import { errorReporter } from './errorReporting';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const todoValidationRules: ValidationRule[] = [
  {
    validate: (value: string) => value.trim().length > 0,
    message: 'Todo cannot be empty',
  },
  {
    validate: (value: string) => value.trim().length <= 100,
    message: 'Todo cannot be longer than 100 characters',
  },
  {
    validate: (value: string) => !/^\s+$/.test(value),
    message: 'Todo cannot contain only whitespace',
  },
  {
    validate: (value: string) => value.trim().length >= 3,
    message: 'Todo must be at least 3 characters long',
  },
];

export function validateTodo(value: string): ValidationResult {
  try {
    for (const rule of todoValidationRules) {
      if (!rule.validate(value)) {
        const error = new ValidationError(rule.message);
        errorReporter.reportValidationError(error, { value });
        return {
          isValid: false,
          error: rule.message,
        };
      }
    }
    return { isValid: true };
  } catch (error) {
    errorReporter.reportValidationError(error as Error, { value });
    return {
      isValid: false,
      error: 'An unexpected validation error occurred',
    };
  }
} 