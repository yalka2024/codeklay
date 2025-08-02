import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../@backend/api/database/prisma.service';
import { AuthModule } from '../@backend/api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

describe('Auth API Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prismaService.session.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.auditLog.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    const validRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(validRegisterData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(validRegisterData.email);
      expect(response.body.user.firstName).toBe(validRegisterData.firstName);
      expect(response.body.user.lastName).toBe(validRegisterData.lastName);
      expect(response.body.user).not.toHaveProperty('passwordHash');
      expect(response.body.message).toBe('User registered successfully');

      // Verify user was created in database
      const user = await prismaService.user.findUnique({
        where: { email: validRegisterData.email },
      });
      expect(user).toBeTruthy();
      expect(user?.email).toBe(validRegisterData.email);

      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(validRegisterData.password, user!.passwordHash);
      expect(isPasswordValid).toBe(true);

      // Verify audit log was created
      const auditLog = await prismaService.auditLog.findFirst({
        where: { action: 'USER_REGISTERED' },
      });
      expect(auditLog).toBeTruthy();
    });

    it('should return 400 for duplicate email', async () => {
      // Create first user
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(validRegisterData)
        .expect(201);

      // Try to register with same email
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(validRegisterData)
        .expect(400);

      expect(response.body.message).toBe('User with this email already exists');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidData = { ...validRegisterData, email: 'invalid-email' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Invalid email format');
    });

    it('should return 400 for weak password', async () => {
      const weakPasswordData = { ...validRegisterData, password: '123' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(weakPasswordData)
        .expect(400);

      expect(response.body.message).toBe('Password must be at least 8 characters long');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = { email: 'test@example.com' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toContain('firstName');
      expect(response.body.message).toContain('lastName');
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash(validLoginData.password, 12);
      await prismaService.user.create({
        data: {
          email: validLoginData.email,
          passwordHash: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
        },
      });
    });

    it('should login user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(validLoginData.email);
      expect(response.body.user).not.toHaveProperty('passwordHash');

      // Verify session was created
      const session = await prismaService.session.findFirst({
        where: { userId: response.body.user.id },
      });
      expect(session).toBeTruthy();
      expect(session?.refreshToken).toBe(response.body.refreshToken);

      // Verify audit log was created
      const auditLog = await prismaService.auditLog.findFirst({
        where: { action: 'USER_LOGIN' },
      });
      expect(auditLog).toBeTruthy();
    });

    it('should return 401 for invalid credentials', async () => {
      const invalidData = { ...validLoginData, password: 'wrongpassword' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(invalidData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const nonExistentData = { ...validLoginData, email: 'nonexistent@example.com' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(nonExistentData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for missing credentials', async () => {
      const incompleteData = { email: 'test@example.com' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create a test user and session
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
        },
      });

      userId = user.id;
      refreshToken = 'valid-refresh-token';
      
      await prismaService.session.create({
        data: {
          userId,
          refreshToken,
          expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        },
      });
    });

    it('should refresh access token successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(userId);
      expect(response.body.accessToken).not.toBe(refreshToken);
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.message).toBe('Invalid refresh token');
    });

    it('should return 401 for expired refresh token', async () => {
      // Create expired session
      await prismaService.session.update({
        where: { refreshToken },
        data: { expiresAt: new Date(Date.now() - 3600000) }, // 1 hour ago
      });

      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(response.body.message).toBe('Refresh token expired');
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.message).toContain('refreshToken');
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create a test user and session
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
        },
      });

      refreshToken = 'valid-refresh-token';
      
      await prismaService.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 3600000),
        },
      });
    });

    it('should logout user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');

      // Verify session was deleted
      const session = await prismaService.session.findUnique({
        where: { refreshToken },
      });
      expect(session).toBeNull();

      // Verify audit log was created
      const auditLog = await prismaService.auditLog.findFirst({
        where: { action: 'USER_LOGOUT' },
      });
      expect(auditLog).toBeTruthy();
    });

    it('should handle logout for non-existent session', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({ refreshToken: 'non-existent-token' })
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({})
        .expect(400);

      expect(response.body.message).toContain('refreshToken');
    });
  });

  describe('POST /api/auth/change-password', () => {
    let userId: string;
    let accessToken: string;

    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('oldpassword123', 12);
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
        },
      });

      userId = user.id;

      // Login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'oldpassword123',
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should change password successfully', async () => {
      const changePasswordData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordData)
        .expect(200);

      expect(response.body.message).toBe('Password changed successfully');

      // Verify password was updated
      const user = await prismaService.user.findUnique({
        where: { id: userId },
      });
      const isNewPasswordValid = await bcrypt.compare(changePasswordData.newPassword, user!.passwordHash);
      expect(isNewPasswordValid).toBe(true);

      // Verify all sessions were deleted
      const sessions = await prismaService.session.findMany({
        where: { userId },
      });
      expect(sessions).toHaveLength(0);

      // Verify audit log was created
      const auditLog = await prismaService.auditLog.findFirst({
        where: { action: 'PASSWORD_CHANGED' },
      });
      expect(auditLog).toBeTruthy();
    });

    it('should return 401 for incorrect current password', async () => {
      const changePasswordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordData)
        .expect(401);

      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should return 400 for weak new password', async () => {
      const changePasswordData = {
        currentPassword: 'oldpassword123',
        newPassword: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(response.body.message).toBe('Password must be at least 8 characters long');
    });

    it('should return 401 for missing authorization', async () => {
      const changePasswordData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .send(changePasswordData)
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
        },
      });

      userId = user.id;

      // Login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should return current user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('firstName', 'John');
      expect(response.body).toHaveProperty('lastName', 'Doe');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });
  });
}); 
