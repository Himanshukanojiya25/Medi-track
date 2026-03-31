/**
 * @fileoverview API Error Handler
 * @module lib/api/api.error-handler
 * @description Enterprise-grade error handling for API requests with:
 * - Error classification and categorization
 * - User-friendly error messages
 * - Retry logic for transient errors
 * - Error reporting and tracking
 * - Network error handling
 * - Timeout handling
 * 
 * @version 2.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum ApiErrorType {
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_GATEWAY = 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  
  // Application Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  CANCELLED = 'CANCELLED',
  PARSE_ERROR = 'PARSE_ERROR'
}

export interface ApiErrorDetails {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
  endpoint?: string;
  method?: string;
  timestamp: number;
  requestId?: string;
  retryable: boolean;
  userMessage: string;
  technicalMessage: string;
  validationErrors?: ValidationError[];
  metadata?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes: number[];
  retryableErrorTypes: ApiErrorType[];
}

// ============================================================================
// API ERROR CLASS
// ============================================================================

export class ApiError extends Error {
  public readonly type: ApiErrorType;
  public readonly statusCode?: number;
  public readonly originalError?: any;
  public readonly endpoint?: string;
  public readonly method?: string;
  public readonly timestamp: number;
  public readonly requestId?: string;
  public readonly retryable: boolean;
  public readonly userMessage: string;
  public readonly technicalMessage: string;
  public readonly validationErrors?: ValidationError[];
  public readonly metadata?: Record<string, any>;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    
    this.name = 'ApiError';
    this.type = details.type;
    this.statusCode = details.statusCode;
    this.originalError = details.originalError;
    this.endpoint = details.endpoint;
    this.method = details.method;
    this.timestamp = details.timestamp;
    this.requestId = details.requestId;
    this.retryable = details.retryable;
    this.userMessage = details.userMessage;
    this.technicalMessage = details.technicalMessage;
    this.validationErrors = details.validationErrors;
    this.metadata = details.metadata;

    // Maintains proper stack trace for where our error was thrown (Node.js)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.retryable;
  }

  /**
   * Check if error is a specific type
   */
  isType(type: ApiErrorType): boolean {
    return this.type === type;
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return [
      ApiErrorType.NETWORK_ERROR,
      ApiErrorType.TIMEOUT_ERROR,
      ApiErrorType.CONNECTION_ERROR
    ].includes(this.type);
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.statusCode ? this.statusCode >= 400 && this.statusCode < 500 : false;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode ? this.statusCode >= 500 : false;
  }

  /**
   * Convert to JSON for logging/reporting
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      endpoint: this.endpoint,
      method: this.method,
      timestamp: this.timestamp,
      requestId: this.requestId,
      retryable: this.retryable,
      userMessage: this.userMessage,
      technicalMessage: this.technicalMessage,
      validationErrors: this.validationErrors,
      metadata: this.metadata
    };
  }
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

export class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrorTypes: [
      ApiErrorType.NETWORK_ERROR,
      ApiErrorType.TIMEOUT_ERROR,
      ApiErrorType.SERVICE_UNAVAILABLE,
      ApiErrorType.GATEWAY_TIMEOUT,
      ApiErrorType.BAD_GATEWAY
    ]
  };

  private errorListeners: Set<(error: ApiError) => void> = new Set();

  private constructor() {}

  static getInstance(): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler();
    }
    return ApiErrorHandler.instance;
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  /**
   * Handle API error and convert to ApiError
   */
  handleError(error: any, context?: {
    endpoint?: string;
    method?: string;
    requestId?: string;
  }): ApiError {
    const apiError = this.parseError(error, context);
    
    // Notify listeners
    this.notifyListeners(apiError);
    
    // Log error
    this.logError(apiError);
    
    return apiError;
  }

  /**
   * Parse raw error into ApiError
   */
  private parseError(error: any, context?: {
    endpoint?: string;
    method?: string;
    requestId?: string;
  }): ApiError {
    // Already an ApiError
    if (error instanceof ApiError) {
      return error;
    }

    // Network/Axios error
    if (error.isAxiosError || error.request) {
      return this.parseNetworkError(error, context);
    }

    // HTTP Response error
    if (error.response) {
      return this.parseHttpError(error, context);
    }

    // Generic error
    return this.parseGenericError(error, context);
  }

  /**
   * Parse network errors (timeout, connection, etc.)
   */
  private parseNetworkError(error: any, context?: {
    endpoint?: string;
    method?: string;
    requestId?: string;
  }): ApiError {
    let type = ApiErrorType.NETWORK_ERROR;
    let userMessage = 'Unable to connect to the server. Please check your internet connection.';

    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      type = ApiErrorType.TIMEOUT_ERROR;
      userMessage = 'Request timed out. Please try again.';
    }
    // Network error
    else if (error.code === 'ENOTFOUND' || error.message?.includes('Network Error')) {
      type = ApiErrorType.CONNECTION_ERROR;
      userMessage = 'No internet connection. Please check your network.';
    }
    // Request cancelled
    else if (error.code === 'ERR_CANCELED') {
      type = ApiErrorType.CANCELLED;
      userMessage = 'Request was cancelled.';
    }

    return new ApiError({
      type,
      message: error.message || 'Network error occurred',
      originalError: error,
      endpoint: context?.endpoint || error.config?.url,
      method: context?.method || error.config?.method?.toUpperCase(),
      timestamp: Date.now(),
      requestId: context?.requestId,
      retryable: type !== ApiErrorType.CANCELLED,
      userMessage,
      technicalMessage: `${type}: ${error.message || 'Unknown network error'}`
    });
  }

  /**
   * Parse HTTP response errors (4xx, 5xx)
   */
  private parseHttpError(error: any, context?: {
    endpoint?: string;
    method?: string;
    requestId?: string;
  }): ApiError {
    const response = error.response;
    const statusCode = response?.status;
    const data = response?.data;

    let type = ApiErrorType.UNKNOWN_ERROR;
    let userMessage = 'An error occurred. Please try again.';
    let retryable = false;
    let validationErrors: ValidationError[] | undefined;

    switch (statusCode) {
      case 400:
        type = ApiErrorType.BAD_REQUEST;
        userMessage = data?.message || 'Invalid request. Please check your input.';
        validationErrors = this.extractValidationErrors(data);
        if (validationErrors.length > 0) {
          type = ApiErrorType.VALIDATION_ERROR;
        }
        break;

      case 401:
        type = ApiErrorType.UNAUTHORIZED;
        userMessage = 'Your session has expired. Please login again.';
        break;

      case 403:
        type = ApiErrorType.FORBIDDEN;
        userMessage = 'You do not have permission to perform this action.';
        break;

      case 404:
        type = ApiErrorType.NOT_FOUND;
        userMessage = 'The requested resource was not found.';
        break;

      case 409:
        type = ApiErrorType.CONFLICT;
        userMessage = data?.message || 'A conflict occurred. Please try again.';
        break;

      case 429:
        type = ApiErrorType.RATE_LIMITED;
        userMessage = 'Too many requests. Please wait a moment and try again.';
        retryable = true;
        break;

      case 500:
        type = ApiErrorType.INTERNAL_SERVER_ERROR;
        userMessage = 'Server error occurred. Please try again later.';
        retryable = true;
        break;

      case 502:
        type = ApiErrorType.BAD_GATEWAY;
        userMessage = 'Service temporarily unavailable. Please try again.';
        retryable = true;
        break;

      case 503:
        type = ApiErrorType.SERVICE_UNAVAILABLE;
        userMessage = 'Service is currently unavailable. Please try again later.';
        retryable = true;
        break;

      case 504:
        type = ApiErrorType.GATEWAY_TIMEOUT;
        userMessage = 'Request timed out. Please try again.';
        retryable = true;
        break;

      default:
        if (statusCode && statusCode >= 500) {
          type = ApiErrorType.INTERNAL_SERVER_ERROR;
          userMessage = 'Server error occurred. Please try again later.';
          retryable = true;
        }
    }

    return new ApiError({
      type,
      message: data?.message || error.message || `HTTP ${statusCode} error`,
      statusCode,
      originalError: error,
      endpoint: context?.endpoint || error.config?.url,
      method: context?.method || error.config?.method?.toUpperCase(),
      timestamp: Date.now(),
      requestId: context?.requestId || response?.headers?.['x-request-id'],
      retryable,
      userMessage,
      technicalMessage: `${type} (${statusCode}): ${data?.message || error.message}`,
      validationErrors,
      metadata: data?.metadata
    });
  }

  /**
   * Parse generic errors
   */
  private parseGenericError(error: any, context?: {
    endpoint?: string;
    method?: string;
    requestId?: string;
  }): ApiError {
    return new ApiError({
      type: ApiErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      originalError: error,
      endpoint: context?.endpoint,
      method: context?.method,
      timestamp: Date.now(),
      requestId: context?.requestId,
      retryable: false,
      userMessage: 'An unexpected error occurred. Please try again.',
      technicalMessage: error.message || 'Unknown error'
    });
  }

  /**
   * Extract validation errors from response data
   */
  private extractValidationErrors(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Common formats
    if (data?.errors && Array.isArray(data.errors)) {
      data.errors.forEach((err: any) => {
        if (typeof err === 'object') {
          errors.push({
            field: err.field || err.path || 'unknown',
            message: err.message || 'Validation failed',
            code: err.code,
            value: err.value
          });
        }
      });
    }
    // Express-validator format
    else if (data?.errors && typeof data.errors === 'object') {
      Object.entries(data.errors).forEach(([field, error]: [string, any]) => {
        errors.push({
          field,
          message: error.message || error.msg || 'Validation failed',
          code: error.code,
          value: error.value
        });
      });
    }
    // Zod format
    else if (data?.issues && Array.isArray(data.issues)) {
      data.issues.forEach((issue: any) => {
        errors.push({
          field: issue.path?.join('.') || 'unknown',
          message: issue.message || 'Validation failed',
          code: issue.code
        });
      });
    }

    return errors;
  }

  // ============================================================================
  // RETRY LOGIC
  // ============================================================================

  /**
   * Check if error should be retried
   */
  shouldRetry(error: ApiError, attemptNumber: number): boolean {
    if (attemptNumber >= this.retryConfig.maxRetries) {
      return false;
    }

    if (!error.retryable) {
      return false;
    }

    // Check if error type is retryable
    if (this.retryConfig.retryableErrorTypes.includes(error.type)) {
      return true;
    }

    // Check if status code is retryable
    if (error.statusCode && this.retryConfig.retryableStatusCodes.includes(error.statusCode)) {
      return true;
    }

    return false;
  }

  /**
   * Get retry delay (exponential backoff)
   */
  getRetryDelay(attemptNumber: number): number {
    return this.retryConfig.retryDelay * Math.pow(2, attemptNumber - 1);
  }

  /**
   * Update retry configuration
   */
  updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  // ============================================================================
  // ERROR LISTENERS
  // ============================================================================

  /**
   * Add error listener
   */
  addErrorListener(listener: (error: ApiError) => void): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(error: ApiError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('[ApiErrorHandler] Listener error:', err);
      }
    });
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  /**
   * Log error to console
   */
  private logError(error: ApiError): void {
    const logData = {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      endpoint: error.endpoint,
      method: error.method,
      requestId: error.requestId,
      timestamp: new Date(error.timestamp).toISOString()
    };

    if (error.isServerError() || error.isNetworkError()) {
      console.error('[ApiErrorHandler] Error:', logData);
    } else {
      console.warn('[ApiErrorHandler] Error:', logData);
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiErrorHandler = ApiErrorHandler.getInstance();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Handle API error (convenience function)
 */
export const handleApiError = (error: any, context?: {
  endpoint?: string;
  method?: string;
  requestId?: string;
}): ApiError => {
  return apiErrorHandler.handleError(error, context);
};

/**
 * Check if error should be retried
 */
export const shouldRetryError = (error: ApiError, attemptNumber: number): boolean => {
  return apiErrorHandler.shouldRetry(error, attemptNumber);
};

/**
 * Get retry delay for attempt
 */
export const getRetryDelay = (attemptNumber: number): number => {
  return apiErrorHandler.getRetryDelay(attemptNumber);
};

/**
 * Create custom API error
 */
export const createApiError = (
  type: ApiErrorType,
  message: string,
  options?: Partial<Omit<ApiErrorDetails, 'type' | 'message' | 'timestamp'>>
): ApiError => {
  return new ApiError({
    type,
    message,
    timestamp: Date.now(),
    retryable: false,
    userMessage: message,
    technicalMessage: message,
    ...options
  });
};

// ============================================================================
// ERROR MATCHERS
// ============================================================================

export const isNetworkError = (error: any): error is ApiError => {
  return error instanceof ApiError && error.isNetworkError();
};

export const isUnauthorizedError = (error: any): error is ApiError => {
  return error instanceof ApiError && error.type === ApiErrorType.UNAUTHORIZED;
};

export const isValidationError = (error: any): error is ApiError => {
  return error instanceof ApiError && error.type === ApiErrorType.VALIDATION_ERROR;
};

export const isServerError = (error: any): error is ApiError => {
  return error instanceof ApiError && error.isServerError();
};

export const isRetryableError = (error: any): error is ApiError => {
  return error instanceof ApiError && error.retryable;
};