import { Test, TestingModule } from '@nestjs/testing';
import { CompleteAPIService } from '../../backend/api/complete-api.service';
import { PrismaService } from '../../backend/api/database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('CompleteAPIService', () => {
  let service: CompleteAPIService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompleteAPIService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CompleteAPIService>(CompleteAPIService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSystemHealth', () => {
    it('should return system health status', async () => {
      const result = await service.getSystemHealth();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result.status).toBe('healthy');
    });
  });

  describe('getAPIMetrics', () => {
    it('should return API metrics', async () => {
      const result = await service.getAPIMetrics();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('requests');
      expect(result).toHaveProperty('uptime');
    });
  });
});

