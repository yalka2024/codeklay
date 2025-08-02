import { Test, TestingModule } from '@nestjs/testing';
import { AuthMiddleware } from '../../backend/api/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
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

    middleware = module.get<AuthMiddleware>(AuthMiddleware);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should validate JWT token', () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };
      const mockRes = {};
      const mockNext = jest.fn();

      mockJwtService.verify.mockReturnValue({ sub: 'user1', email: 'test@example.com' });
      mockConfigService.get.mockReturnValue('jwt-secret');

      middleware.use(mockReq, mockRes, mockNext);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', { secret: 'jwt-secret' });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing authorization header', () => {
      const mockReq = {
        headers: {},
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      middleware.use(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });
});

