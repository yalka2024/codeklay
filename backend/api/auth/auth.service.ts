import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { ConfigService } from "@nestjs/config"
import { PrismaService } from "../database/prisma.service"
import { hash, compare } from "bcryptjs"
import * as speakeasy from "speakeasy"
import * as QRCode from "qrcode"
import * as crypto from "crypto"
import nodemailer from "nodemailer"
import zxcvbn from "zxcvbn"

export interface LoginDto {
  email: string
  password: string
  mfaCode?: string
}

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  organizationName?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    organizationId: string
    permissions: string[]
  }
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
  mfaRequired?: boolean
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existingUser) {
      throw new ConflictException('User already exists')
    }
    
    const passwordStrength = zxcvbn(dto.password)
    if (passwordStrength.score < 3) {
      throw new UnauthorizedException('Password is too weak. Please use a stronger password.')
    }
    
    if (dto.password.length < 12) {
      throw new UnauthorizedException('Password must be at least 12 characters long')
    }
    
    const hashedPassword = await hash(dto.password, 12)
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: `${dto.firstName} ${dto.lastName}`,
        hashedPassword,
        role: 'user',
        emailVerificationToken,
      },
    })
    
    await this.sendVerificationEmail(user.email!, emailVerificationToken)
    
    const tokens = await this.generateTokens(user.id, user.email || '')
    return {
      user: {
        id: user.id,
        email: user.email!,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: user.role,
        organizationId: '',
        permissions: [],
      },
      tokens,
      mfaRequired: false,
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user || !user.hashedPassword) {
      await this.incrementLoginAttempts(dto.email)
      throw new UnauthorizedException('Invalid credentials')
    }
    
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked due to too many failed login attempts')
    }
    
    const valid = await compare(dto.password, user.hashedPassword)
    if (!valid) {
      await this.incrementLoginAttempts(dto.email)
      throw new UnauthorizedException('Invalid credentials')
    }
    
    if (user.mfaEnabled && !dto.mfaCode) {
      return {
        user: {
          id: user.id,
          email: user.email!,
          firstName: '',
          lastName: '',
          role: user.role,
          organizationId: '',
          permissions: [],
        },
        tokens: { accessToken: '', refreshToken: '', expiresIn: 0 },
        mfaRequired: true,
      }
    }
    
    if (user.mfaEnabled && dto.mfaCode) {
      const isValidMFA = speakeasy.totp.verify({
        secret: user.mfaSecret!,
        encoding: 'base32',
        token: dto.mfaCode,
        window: 2,
      })
      
      if (!isValidMFA) {
        throw new UnauthorizedException('Invalid MFA code')
      }
    }
    
    await this.resetLoginAttempts(user.id)
    
    const tokens = await this.generateTokens(user.id, user.email || '')
    const [firstName, lastName] = (user.name || '').split(' ')
    return {
      user: {
        id: user.id,
        email: user.email!,
        firstName: firstName || '',
        lastName: lastName || '',
        role: user.role,
        organizationId: '',
        permissions: [],
      },
      tokens,
      mfaRequired: false,
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, { 
        secret: this.configService.get('JWT_REFRESH_SECRET') 
      }) as any
      
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } })
      if (!user) {
        throw new UnauthorizedException('User not found')
      }
      
      const payload = { sub: user.id, email: user.email }
      const accessToken = await this.jwtService.signAsync(payload, { 
        secret: this.configService.get('JWT_SECRET'), 
        expiresIn: '15m' 
      })
      
      return { accessToken, expiresIn: 900 }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId }
    })
    return
  }

  private async generateTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload = { sub: userId, email }
    const accessToken = await this.jwtService.signAsync(payload, { 
      secret: this.configService.get('JWT_SECRET'), 
      expiresIn: '15m' 
    })
    const refreshToken = await this.jwtService.signAsync(payload, { 
      secret: this.configService.get('JWT_REFRESH_SECRET'), 
      expiresIn: '7d' 
    })
    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    }
  }

  async enableMfa(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    
    const secret = speakeasy.generateSecret({
      name: `CodePal (${user.email})`,
      account: user.email!,
      length: 32
    })
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 }
    })
    
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!)
    return { secret: secret.base32!, qrCode }
  }

  async verifyMfa(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.mfaSecret) {
      throw new UnauthorizedException('MFA not set up')
    }
    
    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2,
    })
    
    if (isValid) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true }
      })
    }
    
    return isValid
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token }
    })
    
    if (!user) {
      throw new UnauthorizedException('Invalid verification token')
    }
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date(),
        emailVerificationToken: null 
      }
    })
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      return
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000)
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    })
    
    await this.sendPasswordResetEmail(email, resetToken)
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() }
      }
    })
    
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token')
    }
    
    const passwordStrength = zxcvbn(newPassword)
    if (passwordStrength.score < 3) {
      throw new UnauthorizedException('Password is too weak. Please use a stronger password.')
    }
    
    if (newPassword.length < 12) {
      throw new UnauthorizedException('Password must be at least 12 characters long')
    }
    
    const hashedPassword = await hash(newPassword, 12)
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })
  }

  private async incrementLoginAttempts(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return
    
    const attempts = user.loginAttempts + 1
    const lockoutUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: attempts,
        lockoutUntil
      }
    })
  }

  private async resetLoginAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockoutUntil: null
      }
    })
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_SERVICE_KEY')
      }
    })
    
    const verificationUrl = `${this.configService.get('NEXTAUTH_URL')}/auth/verify-email?token=${token}`
    
    await transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Verify your CodePal account',
      html: `
        <h1>Welcome to CodePal!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    })
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_SERVICE_KEY')
      }
    })
    
    const resetUrl = `${this.configService.get('NEXTAUTH_URL')}/auth/reset-password?token=${token}`
    
    await transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Reset your CodePal password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    })
  }
}
