import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from '../../backend/api/ai/ai.service';
import { PrismaService } from '../../backend/api/database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AIService', () => {
  let service: AIService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    project: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
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

    service = module.get<AIService>(AIService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCode', () => {
    it('should generate code successfully', async () => {
      const mockContext = {
        projectId: 'project1',
        files: [],
        dependencies: ['react', 'typescript'],
        framework: 'react',
        language: 'javascript',
        recentChanges: [],
        userPreferences: {},
      };
      
      mockConfigService.get.mockReturnValue('test-api-key');

      const result = await service.generateCode('test prompt', mockContext);
      
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
    });

    it('should handle empty prompt', async () => {
      const mockContext = {
        projectId: 'project1',
        files: [],
        dependencies: [],
        framework: 'react',
        language: 'javascript',
        recentChanges: [],
        userPreferences: {},
      };

      await expect(
        service.generateCode('', mockContext)
      ).rejects.toThrow();
    });
  });
});

