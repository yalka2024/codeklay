import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../backend/api/auth/auth.service';
import { PrismaService } from '../../../backend/api/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt to prevent redefinition errors
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock zxcvbn for password strength testing
jest.mock('zxcvbn', () => jest.fn(() => ({ score: 4 })));

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // Manually inject the mocked services
    (service as any).prisma = mockPrismaService;
    (service as any).jwtService = mockJwtService;
    (service as any).configService = mockConfigService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
      const registerDto = {
    email: 'test@example.com',
    password: 'password123456',
    firstName: 'John',
    lastName: 'Doe',
  };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        email: registerDto.email,
        name: `${registerDto.firstName} ${registerDto.lastName}`,
        role: 'user',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync = jest.fn()
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockConfigService.get.mockReturnValue('jwt-secret');
      
      // Mock zxcvbn to return strong password
      const zxcvbn = require('zxcvbn');
      zxcvbn.mockReturnValue({ score: 4 });

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          name: `${registerDto.firstName} ${registerDto.lastName}`,
          hashedPassword,
          role: 'user',
          emailVerificationToken: expect.any(String),
        },
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: mockUser.role,
          organizationId: '',
          permissions: [],
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          expiresIn: 900,
        },
        mfaRequired: false,
      });
    });

    it('should throw error if user already exists', async () => {
      const existingUser = { id: '1', email: registerDto.email };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should throw error if password is too weak', async () => {
      const weakPasswordDto = { ...registerDto, password: 'weakpassword123' };
      
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const zxcvbn = require('zxcvbn');
      zxcvbn.mockReturnValue({ score: 1 });

      await expect(service.register(weakPasswordDto)).rejects.toThrow(
        'Password is too weak. Please use a stronger password.',
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user', async () => {
      const mockUser = {
        id: '1',
        email: loginDto.email,
        hashedPassword: 'hashedPassword123',
        name: 'John Doe',
        role: 'user',
        mfaEnabled: false,
      };
      const mockToken = 'jwt-token';
      const mockRefreshToken = 'refresh-token';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync = jest.fn()
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(mockRefreshToken);
      mockConfigService.get.mockReturnValue('jwt-secret');

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.hashedPassword);
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: 'John',
          lastName: 'Doe',
          role: mockUser.role,
          organizationId: '',
          permissions: [],
        },
        tokens: {
          accessToken: mockToken,
          refreshToken: mockRefreshToken,
          expiresIn: 900,
        },
        mfaRequired: false,
      });
    });

    it('should throw error if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        id: '1',
        email: loginDto.email,
        hashedPassword: 'hashedPassword123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'valid-refresh-token';

    it('should successfully refresh access token', async () => {
      const mockPayload = { sub: '1', email: 'test@example.com' };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
      };
      const mockNewToken = 'new-jwt-token';

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockNewToken);
      mockConfigService.get.mockReturnValue('jwt-secret');

      const result = await service.refreshToken(refreshToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: expect.any(String),
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
      });
      expect(result).toEqual({
        accessToken: mockNewToken,
        expiresIn: 900,
      });
    });

    it('should throw error if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if user not found', async () => {
      const mockPayload = { sub: '1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if JWT verification fails', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const userId = '1';
      const refreshToken = 'valid-refresh-token';

      mockPrismaService.session.deleteMany.mockResolvedValue({ count: 1 });

      await service.logout(userId, refreshToken);

      expect(mockPrismaService.session.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should handle logout when session not found', async () => {
      const userId = '1';
      const refreshToken = 'invalid-refresh-token';

      mockPrismaService.session.deleteMany.mockResolvedValue({ count: 0 });

      await service.logout(userId, refreshToken);

      expect(mockPrismaService.session.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });


}); 
