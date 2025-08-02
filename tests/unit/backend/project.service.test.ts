import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../../backend/api/projects/project.service';
import { PrismaService } from '../../backend/api/database/prisma.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectMember: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    projectFile: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
      };
      const userId = 'user1';

      const mockUser = { id: userId, email: 'test@example.com' };
      const mockProject = {
        id: 'project1',
        name: projectData.name,
        description: projectData.description,
        ownerId: userId,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: mockUser,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.project.create.mockResolvedValue(mockProject);
      mockPrismaService.projectMember.create.mockResolvedValue({});

      const result = await service.createProject(userId, projectData);

      expect(result).toBeDefined();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
    });

    it('should throw error for invalid user', async () => {
      const projectData = { name: 'Test Project' };
      const userId = 'invalid-user';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.createProject(userId, projectData)).rejects.toThrow('User not found');
    });
  });

  describe('getUserProjects', () => {
    it('should return user projects', async () => {
      const userId = 'user1';
      const mockMemberships = [
        { projectId: 'project1', project: { id: 'project1', name: 'Project 1' } },
        { projectId: 'project2', project: { id: 'project2', name: 'Project 2' } },
      ];

      mockPrismaService.projectMember.findMany.mockResolvedValue(mockMemberships);

      const result = await service.getUserProjects(userId);

      expect(result).toBeDefined();
      expect(mockPrismaService.projectMember.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { project: true },
      });
    });
  });
});

