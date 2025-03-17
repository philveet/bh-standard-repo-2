/**
 * Centralized error handling system for API wrappers
 * This provides standard error classes and utilities to ensure
 * consistent error handling across all API integrations.
 */

// Base API error class that all other API errors extend
export class ApiError extends Error {
  public statusCode?: number;
  public isOperational: boolean;
  public context?: Record<string, any>;

  constructor(message: string, options: {
    statusCode?: number;
    isOperational?: boolean; // True for expected errors (like validation), false for unexpected system errors
    context?: Record<string, any>;
    cause?: Error;
  } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode;
    this.isOperational = options.isOperational ?? true;
    this.context = options.context;
    this.cause = options.cause;
    
    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication and authorization errors
export class AuthError extends ApiError {
  constructor(message: string, options: {
    statusCode?: number;
    context?: Record<string, any>;
    cause?: Error;
  } = {}) {
    super(message, { 
      statusCode: options.statusCode || 401,
      isOperational: true,
      context: options.context,
      cause: options.cause
    });
  }
}

// API is not enabled in the project
export class ApiNotEnabledError extends ApiError {
  constructor(apiName: string) {
    super(`${apiName} API is not enabled in this project`, {
      statusCode: 501,
      isOperational: true,
      context: { apiName }
    });
  }
}

// Missing required API credentials
export class ApiCredentialsError extends ApiError {
  constructor(credentialName: string) {
    super(`${credentialName} is not defined`, {
      statusCode: 500,
      isOperational: true,
      context: { credentialName }
    });
  }
}

// Rate limiting errors
export class RateLimitError extends ApiError {
  public retryAfter?: number;

  constructor(message: string, options: {
    retryAfter?: number;
    context?: Record<string, any>;
    cause?: Error;
  } = {}) {
    super(message, {
      statusCode: 429,
      isOperational: true,
      context: options.context,
      cause: options.cause
    });
    this.retryAfter = options.retryAfter;
  }
}

// Bad requests to the API
export class BadRequestError extends ApiError {
  constructor(message: string, options: {
    context?: Record<string, any>;
    cause?: Error;
  } = {}) {
    super(message, {
      statusCode: 400,
      isOperational: true,
      context: options.context,
      cause: options.cause
    });
  }
}

// Service unavailable
export class ServiceUnavailableError extends ApiError {
  constructor(message: string, options: {
    context?: Record<string, any>;
    cause?: Error;
  } = {}) {
    super(message, {
      statusCode: 503,
      isOperational: true,
      context: options.context,
      cause: options.cause
    });
  }
}

// Utility function to format error messages for logging
export function formatErrorForLogging(error: unknown): Record<string, any> {
  if (error instanceof ApiError) {
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      context: error.context,
      cause: error.cause ? (error.cause as Error).message : undefined,
      stack: error.stack
    };
  }
  
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      cause: error.cause ? (error.cause as Error).message : undefined,
      stack: error.stack
    };
  }
  
  return {
    message: 'Unknown error',
    error: String(error)
  };
}

// Helper function to wrap async API calls with standardized error handling
export async function withErrorHandling<T>(
  apiName: string,
  fn: () => Promise<T>,
  errorTransformer?: (error: unknown) => Error
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    // First check for specific known errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // If a custom error transformer is provided, use it
    if (errorTransformer) {
      throw errorTransformer(error);
    }
    
    // Default transformation based on common error patterns
    if (error instanceof Error) {
      // Handle common API errors based on message patterns
      const message = error.message.toLowerCase();
      
      if (message.includes('unauthorized') || message.includes('unauthenticated') || 
          message.includes('invalid key') || message.includes('auth')) {
        throw new AuthError(`${apiName} authentication failed: ${error.message}`, { cause: error });
      }
      
      if (message.includes('rate limit') || message.includes('too many requests')) {
        throw new RateLimitError(`${apiName} rate limit exceeded: ${error.message}`, { cause: error });
      }
      
      // Pass through the error with additional context
      throw new ApiError(`${apiName} API error: ${error.message}`, {
        isOperational: false,
        context: { apiName },
        cause: error
      });
    }
    
    // For non-Error objects
    throw new ApiError(`${apiName} unknown error: ${String(error)}`, {
      isOperational: false,
      context: { apiName, originalError: error }
    });
  }
} 