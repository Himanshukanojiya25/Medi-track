/**
 * @fileoverview HTTP Client
 * @module lib/api/http.client
 * @description Enterprise-grade HTTP client with:
 * - Type-safe request/response handling
 * - Automatic error handling
 * - Request cancellation support
 * - File upload/download support
 * - Progress tracking
 * - Request configuration presets
 * 
 * @version 2.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { setupInterceptors, ApiInterceptorManager } from './api.interceptor';
import { ApiError } from './api.error-handler';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  enableInterceptors?: boolean;
  enableLogging?: boolean;
  enableRetry?: boolean;
  retryAttempts?: number;
}

export interface RequestOptions<T = any> extends Omit<AxiosRequestConfig<T>, 'url' | 'method' | 'data'> {
  skipInterceptor?: boolean;
  skipErrorHandling?: boolean;
}

export interface UploadOptions extends RequestOptions {
  onUploadProgress?: (progressEvent: any) => void;
}

export interface DownloadOptions extends RequestOptions {
  onDownloadProgress?: (progressEvent: any) => void;
  responseType?: 'blob' | 'arraybuffer';
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// HTTP CLIENT CLASS
// ============================================================================

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private interceptorManager?: ApiInterceptorManager;
  private cancelTokens: Map<string, CancelTokenSource> = new Map();

  constructor(config: HttpClientConfig) {
    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      withCredentials: config.withCredentials ?? false
    });

    // Setup interceptors if enabled
    if (config.enableInterceptors !== false) {
      this.interceptorManager = setupInterceptors(this.axiosInstance, {
        enableLogging: config.enableLogging ?? true,
        enableRetry: config.enableRetry ?? true,
        retryAttempts: config.retryAttempts ?? 3
      });
    }
  }

  // ============================================================================
  // REQUEST METHODS
  // ============================================================================

  /**
   * GET request
   */
  async get<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, options);
      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  /**
   * POST request
   */
  async post<T = any, D = any>(url: string, data?: D, options?: RequestOptions<D>): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, options);
      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  /**
   * PUT request
   */
  async put<T = any, D = any>(url: string, data?: D, options?: RequestOptions<D>): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, options);
      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any, D = any>(url: string, data?: D, options?: RequestOptions<D>): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, options);
      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, options);
      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  // ============================================================================
  // FILE OPERATIONS
  // ============================================================================

  /**
   * Upload file(s)
   */
  async upload<T = any>(
    url: string,
    file: File | File[] | FormData,
    options?: UploadOptions
  ): Promise<ApiResponse<T>> {
    try {
      let formData: FormData;

      // Create FormData if not already
      if (file instanceof FormData) {
        formData = file;
      } else {
        formData = new FormData();
        const files = Array.isArray(file) ? file : [file];
        files.forEach((f, index) => {
          formData.append(files.length > 1 ? `file_${index}` : 'file', f);
        });
      }

      const response = await this.axiosInstance.post<T>(url, formData, {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...options?.headers
        },
        onUploadProgress: options?.onUploadProgress
      });

      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  /**
   * Download file
   */
  async download(
    url: string,
    filename?: string,
    options?: DownloadOptions
  ): Promise<Blob> {
    try {
      const response = await this.axiosInstance.get(url, {
        ...options,
        responseType: options?.responseType || 'blob',
        onDownloadProgress: options?.onDownloadProgress
      });

      const blob = new Blob([response.data]);

      // Auto-download if filename provided
      if (filename) {
        this.triggerDownload(blob, filename);
      }

      return blob;
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  /**
   * Trigger browser download
   */
  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ============================================================================
  // PAGINATION SUPPORT
  // ============================================================================

  /**
   * GET paginated data
   */
  async getPaginated<T = any>(
    url: string,
    page: number = 1,
    limit: number = 10,
    options?: RequestOptions
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.axiosInstance.get<PaginatedResponse<T>>(url, {
        ...options,
        params: {
          page,
          limit,
          ...options?.params
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, options);
    }
  }

  // ============================================================================
  // REQUEST CANCELLATION
  // ============================================================================

  /**
   * Create cancellable request
   */
  async cancellable<T = any>(
    key: string,
    requestFn: (cancelToken: CancelTokenSource) => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    // Cancel previous request with same key
    this.cancel(key);

    // Create new cancel token
    const cancelToken = axios.CancelToken.source();
    this.cancelTokens.set(key, cancelToken);

    try {
      const response = await requestFn(cancelToken);
      this.cancelTokens.delete(key);
      return response;
    } catch (error) {
      this.cancelTokens.delete(key);
      throw error;
    }
  }

  /**
   * Cancel request by key
   */
  cancel(key: string, message?: string): void {
    const cancelToken = this.cancelTokens.get(key);
    if (cancelToken) {
      cancelToken.cancel(message || 'Request cancelled');
      this.cancelTokens.delete(key);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(message?: string): void {
    this.cancelTokens.forEach((cancelToken) => {
      cancelToken.cancel(message || 'All requests cancelled');
    });
    this.cancelTokens.clear();
  }

  // ============================================================================
  // BATCH REQUESTS
  // ============================================================================

  /**
   * Execute multiple requests in parallel
   */
  async batch<T = any>(requests: Array<() => Promise<ApiResponse<any>>>): Promise<T[]> {
    try {
      const responses = await Promise.all(requests.map(req => req()));
      return responses.map(res => res.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Execute multiple requests sequentially
   */
  async sequence<T = any>(requests: Array<() => Promise<ApiResponse<any>>>): Promise<T[]> {
    const results: T[] = [];

    for (const request of requests) {
      try {
        const response = await request();
        results.push(response.data);
      } catch (error) {
        throw this.handleError(error);
      }
    }

    return results;
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Transform axios response to ApiResponse
   */
  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>
    };
  }

  /**
   * Handle errors
   */
  private handleError(error: any, options?: RequestOptions): never {
    // Skip error handling if requested
    if (options?.skipErrorHandling) {
      throw error;
    }

    // Already an ApiError (from interceptor)
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle other errors
    throw error;
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Update default headers
   */
  setHeaders(headers: Record<string, string>): void {
    Object.entries(headers).forEach(([key, value]) => {
      this.axiosInstance.defaults.headers.common[key] = value;
    });
  }

  /**
   * Get axios instance (for advanced usage)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Get interceptor manager
   */
  getInterceptorManager(): ApiInterceptorManager | undefined {
    return this.interceptorManager;
  }

  /**
   * Destroy client and cleanup
   */
  destroy(): void {
    this.cancelAll('Client destroyed');
    if (this.interceptorManager) {
      this.interceptorManager.removeInterceptors();
    }
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create HTTP client instance
 */
export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  return new HttpClient(config);
};

/**
 * Create HTTP client with preset configuration
 */
export const createApiClient = (baseURL: string, config?: Partial<HttpClientConfig>): HttpClient => {
  // Check if running in development (browser-safe)
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location?.hostname === 'localhost' || 
     window.location?.hostname === '127.0.0.1' ||
     window.location?.port !== '');

  return new HttpClient({
    baseURL,
    timeout: 30000,
    enableInterceptors: true,
    enableLogging: isDevelopment,
    enableRetry: true,
    retryAttempts: 3,
    ...config
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

export default HttpClient;
export type { HttpClient as HttpClientType };