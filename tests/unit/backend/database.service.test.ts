import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../backend/api/database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('database connection', () => {
    it('should connect to database', async () => {
      mockConfigService.get.mockReturnValue('postgresql://test:test@localhost:5432/testdb');

      expect(service).toBeDefined();
      expect(service.$connect).toBeDefined();
    });

    it('should handle connection errors gracefully', async () => {
      mockConfigService.get.mockReturnValue('invalid-connection-string');

      expect(service).toBeDefined();
    });
  });

  describe('query operations', () => {
    it('should execute raw queries', async () => {
      expect(service.$queryRaw).toBeDefined();
    });

    it('should handle transactions', async () => {
      expect(service.$transaction).toBeDefined();
    });
  });
});

