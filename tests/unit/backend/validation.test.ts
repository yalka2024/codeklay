import { validate } from 'class-validator';
import { CreateProjectDto } from '../@backend/api/projects/dto/create-project.dto';
import { RegisterDto } from '../@backend/api/auth/dto/register.dto';

describe('Validation Tests', () => {
  describe('CreateProjectDto', () => {
    it('should validate valid project data', async () => {
      const dto = new CreateProjectDto();
      dto.name = 'Test Project';
      dto.description = 'A test project';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty project name', async () => {
      const dto = new CreateProjectDto();
      dto.name = '';
      dto.description = 'A test project';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('RegisterDto', () => {
    it('should validate valid registration data', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.password = 'ValidPassword123!';
      dto.firstName = 'Test';
      dto.lastName = 'User';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid email format', async () => {
      const dto = new RegisterDto();
      dto.email = 'invalid-email';
      dto.password = 'ValidPassword123!';
      dto.firstName = 'Test';
      dto.lastName = 'User';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });
});

