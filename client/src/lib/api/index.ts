/**
 * @fileoverview API Module - Main Entry Point
 * @module lib/api
 * @description Centralized API client with error handling, interceptors, and utilities
 * 
 * @example
 * ```typescript
 * // Simple usage
 * import { apiClient } from '../../lib/api';
 * 
 * const response = await apiClient.get('/users');
 * const user = await apiClient.post('/users', userData);
 * 
 * // With error handling
 * import { apiClient, isUnauthorizedError } from '../../lib/api';
 * 
 * try {
 *   const data = await apiClient.get('/protected');
 * } catch (error) {
 *   if (isUnauthorizedError(error)) {
 *     // Redirect to login
 *   }
 * }
 * 
 * // Custom client
 * import { createApiClient } from '../../lib/api';
 * 
 * const customClient = createApiClient('https://api.example.com', {
 *   timeout: 10000,
 *   enableRetry: false
 * });
 * ```
 * 
 * @version 2.0.0
 */

// ============================================================================
// HTTP CLIENT EXPORTS
// ============================================================================

export {
  HttpClient,
  createHttpClient,
  createApiClient,
  type HttpClientType,
  type HttpClientConfig,
  type RequestOptions,
  type UploadOptions,
  type DownloadOptions,
  type ApiResponse,
  type PaginatedResponse
} from './http.client';

// ============================================================================
// ERROR HANDLER EXPORTS
// ============================================================================

export {
  ApiError,
  ApiErrorHandler,
  apiErrorHandler,
  handleApiError,
  shouldRetryError,
  getRetryDelay,
  createApiError,
  isNetworkError,
  isUnauthorizedError,
  isValidationError,
  isServerError,
  isRetryableError,
  ApiErrorType,
  type ApiErrorDetails,
  type ValidationError,
  type RetryConfig
} from './api.error-handler';

// Import for use in this file
import { ApiError } from './api.error-handler';

// ============================================================================
// INTERCEPTOR EXPORTS
// ============================================================================

export {
  ApiInterceptorManager,
  setupInterceptors,
  type InterceptorConfig,
  type RequestMeta
} from './api.interceptor';

// ============================================================================
// DEFAULT CLIENT INSTANCE
// ============================================================================

import { createApiClient } from './http.client';

/**
 * Default API client instance
 * Configure base URL from environment variable
 */
const getApiBaseUrl = (): string => {
  // Browser environment
  if (typeof window !== 'undefined') {
    // @ts-ignore - Check for environment variables
    return window.ENV?.API_URL || 'http://localhost:5000/api';
  }
  // Node environment (SSR)
  return 'http://localhost:5000/api';
};

export const apiClient = createApiClient(getApiBaseUrl(), {
  timeout: 30000,
  enableInterceptors: true,
  enableLogging: typeof window !== 'undefined' && window.location?.hostname === 'localhost',
  enableRetry: true,
  retryAttempts: 3
});

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * Shorthand HTTP methods using default client
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, options?: import('./http.client').RequestOptions) => 
    apiClient.get<T>(url, options),

  /**
   * POST request
   */
  post: <T = any, D = any>(url: string, data?: D, options?: import('./http.client').RequestOptions<D>) => 
    apiClient.post<T, D>(url, data, options),

  /**
   * PUT request
   */
  put: <T = any, D = any>(url: string, data?: D, options?: import('./http.client').RequestOptions<D>) => 
    apiClient.put<T, D>(url, data, options),

  /**
   * PATCH request
   */
  patch: <T = any, D = any>(url: string, data?: D, options?: import('./http.client').RequestOptions<D>) => 
    apiClient.patch<T, D>(url, data, options),

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, options?: import('./http.client').RequestOptions) => 
    apiClient.delete<T>(url, options),

  /**
   * Upload file(s)
   */
  upload: <T = any>(url: string, file: File | File[] | FormData, options?: import('./http.client').UploadOptions) => 
    apiClient.upload<T>(url, file, options),

  /**
   * Download file
   */
  download: (url: string, filename?: string, options?: import('./http.client').DownloadOptions) => 
    apiClient.download(url, filename, options),

  /**
   * GET paginated data
   */
  getPaginated: <T = any>(url: string, page?: number, limit?: number, options?: import('./http.client').RequestOptions) => 
    apiClient.getPaginated<T>(url, page, limit, options),

  /**
   * Batch requests (parallel)
   */
  batch: <T = any>(requests: Array<() => Promise<import('./http.client').ApiResponse<any>>>) => 
    apiClient.batch<T>(requests),

  /**
   * Sequential requests
   */
  sequence: <T = any>(requests: Array<() => Promise<import('./http.client').ApiResponse<any>>>) => 
    apiClient.sequence<T>(requests),

  /**
   * Cancellable request
   */
  cancellable: <T = any>(key: string, requestFn: (cancelToken: any) => Promise<import('./http.client').ApiResponse<T>>) => 
    apiClient.cancellable<T>(key, requestFn),

  /**
   * Cancel request
   */
  cancel: (key: string, message?: string) => 
    apiClient.cancel(key, message),

  /**
   * Cancel all requests
   */
  cancelAll: (message?: string) => 
    apiClient.cancelAll(message),

  /**
   * Set auth token
   */
  setAuthToken: (token: string) => 
    apiClient.setAuthToken(token),

  /**
   * Remove auth token
   */
  removeAuthToken: () => 
    apiClient.removeAuthToken(),

  /**
   * Set base URL
   */
  setBaseURL: (baseURL: string) => 
    apiClient.setBaseURL(baseURL),

  /**
   * Set headers
   */
  setHeaders: (headers: Record<string, string>) => 
    apiClient.setHeaders(headers)
};

// ============================================================================
// API REQUEST BUILDER
// ============================================================================

/**
 * Fluent API request builder
 */
export class ApiRequestBuilder<T = any> {
  private url: string = '';
  private method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET';
  private data?: any;
  private queryParams: Record<string, any> = {};
  private headers: Record<string, string> = {};
  private requestOptions: import('./http.client').RequestOptions = {};

  /**
   * Set request URL
   */
  to(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Set HTTP method to GET
   */
  get(): this {
    this.method = 'GET';
    return this;
  }

  /**
   * Set HTTP method to POST with data
   */
  post(data?: any): this {
    this.method = 'POST';
    this.data = data;
    return this;
  }

  /**
   * Set HTTP method to PUT with data
   */
  put(data?: any): this {
    this.method = 'PUT';
    this.data = data;
    return this;
  }

  /**
   * Set HTTP method to PATCH with data
   */
  patch(data?: any): this {
    this.method = 'PATCH';
    this.data = data;
    return this;
  }

  /**
   * Set HTTP method to DELETE
   */
  delete(): this {
    this.method = 'DELETE';
    return this;
  }

  /**
   * Add query parameters
   */
  withParams(params: Record<string, any>): this {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * Add headers
   */
  withHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Set request timeout
   */
  withTimeout(timeout: number): this {
    this.requestOptions.timeout = timeout;
    return this;
  }

  /**
   * Execute request
   */
  async send(): Promise<import('./http.client').ApiResponse<T>> {
    const options: import('./http.client').RequestOptions = {
      ...this.requestOptions,
      params: this.queryParams,
      headers: this.headers
    };

    switch (this.method) {
      case 'GET':
        return apiClient.get<T>(this.url, options);
      case 'POST':
        return apiClient.post<T>(this.url, this.data, options);
      case 'PUT':
        return apiClient.put<T>(this.url, this.data, options);
      case 'PATCH':
        return apiClient.patch<T>(this.url, this.data, options);
      case 'DELETE':
        return apiClient.delete<T>(this.url, options);
    }
  }
}

/**
 * Create API request builder
 */
export const createRequest = <T = any>(): ApiRequestBuilder<T> => {
  return new ApiRequestBuilder<T>();
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  });
  
  return query.toString();
};

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};
  
  params.forEach((value, key) => {
    if (result[key]) {
      result[key] = Array.isArray(result[key]) 
        ? [...result[key], value]
        : [result[key], value];
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

/**
 * Create FormData from object
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

/**
 * Check if response is successful (2xx)
 */
export const isSuccessResponse = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Extract error message from error object
 */
export const getErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.userMessage;
  }
  return error?.message || 'An unexpected error occurred';
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if error is ApiError
 */
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Check if response has data
 */
export const hasResponseData = <T>(response: import('./http.client').ApiResponse<T>): response is import('./http.client').ApiResponse<T> & { data: NonNullable<T> } => {
  return response.data !== null && response.data !== undefined;
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default api;