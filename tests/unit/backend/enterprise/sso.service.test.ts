import { Test, TestingModule } from '@nestjs/testing';
import { SSOService } from '../../../backend/api/enterprise/sso.service';
import { PrismaService } from '../../../backend/api/database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SSOService', () => {
  let service: SSOService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SSOService,
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

    service = module.get<SSOService>(SSOService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticateUser', () => {
    it('should authenticate user successfully', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.authenticateUser('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.authenticateUser('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('validateSSOToken', () => {
    it('should validate SSO token successfully', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('test-sso-secret');

      const result = await service.validateSSOToken('valid-token');

      expect(result).toBeDefined();
    });

    it('should return null for invalid token', async () => {
      mockConfigService.get.mockReturnValue('test-sso-secret');
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.validateSSOToken('invalid-token');

      expect(result).toBeNull();
    });
  });
});

