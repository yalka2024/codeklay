import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { ConfigService } from "@nestjs/config"
import { PrismaService } from "../database/prisma.service"
import { hash, compare } from "bcryptjs"

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
    const hashedPassword = await hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: `${dto.firstName} ${dto.lastName}`,
        hashedPassword,
        role: 'user',
      },
    })
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
      throw new UnauthorizedException('Invalid credentials')
    }
    const valid = await compare(dto.password, user.hashedPassword)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }
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
    // Implement refresh token logic as needed
    throw new UnauthorizedException('Not implemented')
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Implement logout logic as needed
    return
  }

  private async generateTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload = { sub: userId, email }
    const accessToken = await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_SECRET'), expiresIn: '15m' })
    const refreshToken = await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_SECRET'), expiresIn: '7d' })
    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    }
  }

  // MFA, email verification, password reset, etc. can be implemented here as needed
  async enableMfa(userId: string): Promise<{ secret: string; qrCode: string }> {
    // Implement MFA logic
    throw new UnauthorizedException('Not implemented')
  }

  async verifyEmail(token: string): Promise<void> {
    // Implement email verification logic
    throw new UnauthorizedException('Not implemented')
  }

  async resetPassword(email: string): Promise<void> {
    // Implement password reset logic
    throw new UnauthorizedException('Not implemented')
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    // Implement password reset confirmation logic
    throw new UnauthorizedException('Not implemented')
  }
}
