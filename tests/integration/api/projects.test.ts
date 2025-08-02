import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../backend/api/database/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('Projects API (Integration)', () => {
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
        email: 'projecttest@example.com',
        name: 'Project Tester',
        hashedPassword: 'hashedPassword',
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'projecttest@example.com',
        password: 'TestPassword123!',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.project.deleteMany({});
    await app.close();
  });

  beforeEach(async () => {
    await prisma.project.deleteMany({});
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project for integration testing',
      };

      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body).toMatchObject({
        name: projectData.name,
        description: projectData.description,
        ownerId: testUser.id,
      });
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for invalid project data', async () => {
      const invalidData = {
        name: '',
        description: 'Invalid project with empty name',
      };

      await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Should fail without auth',
      };

      await request(app.getHttpServer())
        .post('/api/projects')
        .send(projectData)
        .expect(401);
    });
  });

  describe('GET /api/projects', () => {
    it('should return user projects', async () => {
      await prisma.project.createMany({
        data: [
          {
            name: 'Project 1',
            description: 'First project',
            ownerId: testUser.id,
          },
          {
            name: 'Project 2',
            description: 'Second project',
            ownerId: testUser.id,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        name: 'Project 1',
        ownerId: testUser.id,
      });
    });

    it('should return empty array for user with no projects', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});

