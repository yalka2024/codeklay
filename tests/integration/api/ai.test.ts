import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../backend/api/database/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('AI API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();

    testUser = await prisma.user.create({
      data: {
        email: 'aitest@example.com',
        name: 'AI Tester',
        hashedPassword: 'hashedPassword',
      },
    });

    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await app.close();
  });

  describe('POST /api/ai/generate', () => {
    it('should generate code successfully', async () => {
      const requestData = {
        prompt: 'Create a React component',
        context: {
          projectId: 'test-project',
          filePath: 'component.tsx',
          projectType: 'web',
          framework: 'react',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code');
    });

    it('should return 400 for empty prompt', async () => {
      const requestData = {
        prompt: '',
        context: {
          projectId: 'test-project',
          filePath: 'component.tsx',
        },
      };

      await request(app.getHttpServer())
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const requestData = {
        prompt: 'Create a component',
        context: { projectId: 'test' },
      };

      await request(app.getHttpServer())
        .post('/api/ai/generate')
        .send(requestData)
        .expect(401);
    });
  });

  describe('POST /api/ai/review', () => {
    it('should review code successfully', async () => {
      const requestData = {
        code: 'function test() { return "hello"; }',
        language: 'javascript',
        context: {
          projectId: 'test-project',
          filePath: 'test.js',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/api/ai/review')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body).toHaveProperty('issues');
      expect(response.body).toHaveProperty('suggestions');
      expect(response.body).toHaveProperty('overallScore');
    });
  });
});

