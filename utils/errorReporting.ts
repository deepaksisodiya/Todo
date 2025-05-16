import { ErrorInfo } from 'react';

// Types of errors we want to track
export type ErrorType = 'component' | 'storage' | 'network' | 'validation' | 'unknown';

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Error context information
export interface ErrorContext {
  type: ErrorType;
  severity: ErrorSeverity;
  timestamp: number;
  componentStack?: string;
  additionalInfo?: Record<string, unknown>;
}

// Error report structure
export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  handled: boolean;
}

class ErrorReporter {
  private static instance: ErrorReporter;
  private errorQueue: ErrorReport[] = [];
  private readonly MAX_QUEUE_SIZE = 50;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  // Report a React component error
  reportComponentError(error: Error, errorInfo: ErrorInfo): void {
    this.reportError(error, {
      type: 'component',
      severity: 'high',
      timestamp: Date.now(),
      componentStack: errorInfo.componentStack,
    });
  }

  // Report a storage error
  reportStorageError(error: Error, additionalInfo?: Record<string, unknown>): void {
    this.reportError(error, {
      type: 'storage',
      severity: 'medium',
      timestamp: Date.now(),
      additionalInfo,
    });
  }

  // Report a network error
  reportNetworkError(error: Error, additionalInfo?: Record<string, unknown>): void {
    this.reportError(error, {
      type: 'network',
      severity: 'high',
      timestamp: Date.now(),
      additionalInfo,
    });
  }

  // Report a validation error
  reportValidationError(error: Error, additionalInfo?: Record<string, unknown>): void {
    this.reportError(error, {
      type: 'validation',
      severity: 'low',
      timestamp: Date.now(),
      additionalInfo,
    });
  }

  // Generic error reporting method
  private reportError(error: Error, context: ErrorContext): void {
    const errorReport: ErrorReport = {
      error,
      context,
      handled: false,
    };

    // Add to queue
    this.errorQueue.push(errorReport);

    // Keep queue size in check
    if (this.errorQueue.length > this.MAX_QUEUE_SIZE) {
      this.errorQueue.shift();
    }

    // Log error in development
    if (__DEV__) {
      console.error('Error Report:', {
        message: error.message,
        stack: error.stack,
        context,
      });
    }

    // Here you would typically send the error to your error tracking service
    // For example: Sentry, Firebase Crashlytics, etc.
    this.sendToErrorService(errorReport);
  }

  // Method to send errors to an error tracking service
  private sendToErrorService(report: ErrorReport): void {
    // TODO: Implement error service integration
    // This is where you would integrate with your chosen error tracking service
    // For example:
    // Sentry.captureException(report.error, {
    //   extra: report.context,
    // });
  }

  // Get all unhandled errors
  getUnhandledErrors(): ErrorReport[] {
    return this.errorQueue.filter(report => !report.handled);
  }

  // Mark an error as handled
  markErrorAsHandled(error: Error): void {
    const report = this.errorQueue.find(r => r.error === error);
    if (report) {
      report.handled = true;
    }
  }

  // Clear all handled errors from the queue
  clearHandledErrors(): void {
    this.errorQueue = this.errorQueue.filter(report => !report.handled);
  }
}

// Export singleton instance
export const errorReporter = ErrorReporter.getInstance(); 