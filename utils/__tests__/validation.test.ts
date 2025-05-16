import { errorReporter } from '../errorReporting';
import { ValidationError, todoValidationRules, validateTodo } from '../validation';

// Mock error reporter
jest.mock('../errorReporting', () => ({
  errorReporter: {
    reportValidationError: jest.fn(),
  },
}));

describe('Validation Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ValidationError', () => {
    it('should create a ValidationError with correct name and message', () => {
      const error = new ValidationError('Test error');
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Test error');
    });
  });

  describe('todoValidationRules', () => {
    // Test rules in the exact order they are defined
    it('should validate non-whitespace (Rule 1)', () => {
      const rule = todoValidationRules[0];
      expect(rule.validate('Test')).toBe(true);
      expect(rule.validate('  ')).toBe(false);
      expect(rule.validate('\t\n')).toBe(false);
      expect(rule.message).toBe('Todo cannot contain only whitespace');
    });

    it('should validate max length (Rule 3)', () => {
      const rule = todoValidationRules[2];
      expect(rule.validate('A'.repeat(100))).toBe(true);
      expect(rule.validate('A'.repeat(101))).toBe(false);
      expect(rule.message).toBe('Todo cannot be longer than 100 characters');
    });

    it('should validate minimum length (Rule 4)', () => {
      const rule = todoValidationRules[3];
      expect(rule.validate('abc')).toBe(true);
      expect(rule.validate('ab')).toBe(false);
      expect(rule.message).toBe('Todo must be at least 3 characters long');
    });
  });

  describe('validateTodo', () => {
    it('should return valid result for valid todo', () => {
      const result = validateTodo('Valid todo');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(errorReporter.reportValidationError).not.toHaveBeenCalled();
    });

    it('should validate rules in correct order - whitespace only (Rule 1)', () => {
      const result = validateTodo('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Todo cannot contain only whitespace');
      expect(errorReporter.reportValidationError).toHaveBeenCalledWith(
        expect.any(ValidationError),
        { value: '   ' }
      );
    });

    it('should validate rules in correct order - empty (Rule 2)', () => {
      const result = validateTodo('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Todo cannot be empty');
      expect(errorReporter.reportValidationError).toHaveBeenCalledWith(
        expect.any(ValidationError),
        { value: '' }
      );
    });

    it('should validate rules in correct order - too long (Rule 3)', () => {
      const longTodo = 'A'.repeat(101);
      const result = validateTodo(longTodo);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Todo cannot be longer than 100 characters');
      expect(errorReporter.reportValidationError).toHaveBeenCalledWith(
        expect.any(ValidationError),
        { value: longTodo }
      );
    });

    it('should validate rules in correct order - too short (Rule 4)', () => {
      const result = validateTodo('ab');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Todo must be at least 3 characters long');
      expect(errorReporter.reportValidationError).toHaveBeenCalledWith(
        expect.any(ValidationError),
        { value: 'ab' }
      );
    });

    it('should handle unexpected errors', () => {
      const rule = todoValidationRules[0];
      const originalValidate = rule.validate;
      rule.validate = () => {
        throw new Error('Unexpected error');
      };

      const result = validateTodo('test');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('An unexpected validation error occurred');
      expect(errorReporter.reportValidationError).toHaveBeenCalledWith(
        expect.any(Error),
        { value: 'test' }
      );

      // Restore original validate function
      rule.validate = originalValidate;
    });
  });
}); 