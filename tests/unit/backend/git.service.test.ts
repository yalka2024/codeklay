import { Test, TestingModule } from '@nestjs/testing';
import { GitService } from '../@backend/api/git/git.service';
import { PrismaService } from '../@backend/api/database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('GitService', () => {
  let service: GitService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    project: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    projectFile: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitService,
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

    service = module.get<GitService>(GitService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeRepository', () => {
    it('should initialize repository successfully', async () => {
      const mockProject = {
        id: 'project1',
        name: 'Test Project',
        gitUrl: 'https://github.com/test/repo.git',
      };

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);
      mockPrismaService.project.update.mockResolvedValue(mockProject);

      const result = await service.initializeRepository('project1');

      expect(result).toBeDefined();
      expect(mockPrismaService.project.findUnique).toHaveBeenCalledWith({
        where: { id: 'project1' },
      });
    });

    it('should throw error for invalid project', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(
        service.initializeRepository('invalid-project')
      ).rejects.toThrow();
    });
  });
});

