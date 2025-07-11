import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../backend/api/auth/auth.service';
import { PrismaService } from '../../backend/api/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

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
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockPrismaService.auditLog.create.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: hashedPassword,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      });
      expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'USER_REGISTERED',
          userId: mockUser.id,
          details: `User registered with email: ${registerDto.email}`,
        },
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
        message: 'User registered successfully',
      });
    });

    it('should throw error if user already exists', async () => {
      const existingUser = { id: '1', email: registerDto.email };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });

    it('should throw error if email is invalid', async () => {
      const invalidDto = { ...registerDto, email: 'invalid-email' };

      await expect(service.register(invalidDto)).rejects.toThrow(
        'Invalid email format',
      );
    });

    it('should throw error if password is too weak', async () => {
      const weakPasswordDto = { ...registerDto, password: '123' };

      await expect(service.register(weakPasswordDto)).rejects.toThrow(
        'Password must be at least 8 characters long',
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
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockToken = 'jwt-token';
      const mockRefreshToken = 'refresh-token';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockConfigService.get.mockReturnValue('refresh-secret');
      mockJwtService.sign.mockReturnValueOnce(mockToken).mockReturnValueOnce(mockRefreshToken);
      mockPrismaService.session.create.mockResolvedValue({ id: 'session-1' });
      mockPrismaService.auditLog.create.mockResolvedValue({});

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.passwordHash);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.session.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          refreshToken: mockRefreshToken,
          expiresAt: expect.any(Date),
        },
      });
      expect(result).toEqual({
        accessToken: mockToken,
        refreshToken: mockRefreshToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
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
        passwordHash: 'hashedPassword123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

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
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockNewToken = 'new-jwt-token';

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        userId: '1',
        refreshToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockNewToken);

      const result = await service.refreshToken(refreshToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: expect.any(String),
      });
      expect(mockPrismaService.session.findUnique).toHaveBeenCalledWith({
        where: { refreshToken },
      });
      expect(result).toEqual({
        accessToken: mockNewToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      });
    });

    it('should throw error if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if session not found', async () => {
      const mockPayload = { sub: '1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if session is expired', async () => {
      const mockPayload = { sub: '1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        userId: '1',
        refreshToken,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Refresh token expired');
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const refreshToken = 'valid-refresh-token';

      mockPrismaService.session.delete.mockResolvedValue({ id: 'session-1' });
      mockPrismaService.auditLog.create.mockResolvedValue({});

      const result = await service.logout(refreshToken);

      expect(mockPrismaService.session.delete).toHaveBeenCalledWith({
        where: { refreshToken },
      });
      expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'USER_LOGOUT',
          details: 'User logged out successfully',
        },
      });
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should handle logout when session not found', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockPrismaService.session.delete.mockResolvedValue(null);

      const result = await service.logout(refreshToken);

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('validateUser', () => {
    it('should return user if valid', async () => {
      const userId = '1';
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userId = '999';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(userId);

      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      userId: '1',
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
    };

    it('should successfully change password', async () => {
      const mockUser = {
        id: '1',
        passwordHash: 'oldHashedPassword',
      };
      const newHashedPassword = 'newHashedPassword';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(newHashedPassword as never);
      mockPrismaService.user.update.mockResolvedValue({ id: '1' });
      mockPrismaService.session.deleteMany.mockResolvedValue({ count: 2 });
      mockPrismaService.auditLog.create.mockResolvedValue({});

      const result = await service.changePassword(changePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(changePasswordDto.currentPassword, mockUser.passwordHash);
      expect(bcrypt.hash).toHaveBeenCalledWith(changePasswordDto.newPassword, 12);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: changePasswordDto.userId },
        data: { passwordHash: newHashedPassword },
      });
      expect(mockPrismaService.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: changePasswordDto.userId },
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should throw error if current password is incorrect', async () => {
      const mockUser = {
        id: '1',
        passwordHash: 'oldHashedPassword',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.changePassword(changePasswordDto)).rejects.toThrow('Current password is incorrect');
    });

    it('should throw error if new password is too weak', async () => {
      const weakPasswordDto = { ...changePasswordDto, newPassword: '123' };

      await expect(service.changePassword(weakPasswordDto)).rejects.toThrow(
        'Password must be at least 8 characters long',
      );
    });
  });
}); 