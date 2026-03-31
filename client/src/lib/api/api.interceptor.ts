/**
 * @fileoverview API Interceptors
 * @module lib/api/api.interceptor
 * @description Enterprise-grade API interceptors with:
 * - Request/Response logging
 * - Authentication token injection
 * - Request retry logic
 * - Request deduplication
 * - Response caching
 * - Error transformation
 * - Request/Response timing
 * 
 * @version 2.0.0
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiErrorHandler, ApiError } from './api.error-handler';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface InterceptorConfig {
  enableLogging?: boolean;
  enableRetry?: boolean;
  enableDeduplication?: boolean;
  enableTiming?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  requestTimeout?: number;
}

export interface RequestMeta {
  startTime: number;
  attemptNumber: number;
  requestId: string;
  dedupKey?: string;
}

// ============================================================================
// PENDING REQUESTS MANAGER (Deduplication)
// ============================================================================

class PendingRequestsManager {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  /**
   * Generate deduplication key from request config
   */
  private generateKey(config: AxiosRequestConfig): string {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    const params = JSON.stringify(config.params || {});
    return `${method}:${url}:${params}`;
  }

  /**
   * Check if request is pending
   */
  hasPending(config: AxiosRequestConfig): boolean {
    const key = this.generateKey(config);
    return this.pendingRequests.has(key);
  }

  /**
   * Get pending request
   */
  getPending(config: AxiosRequestConfig): Promise<any> | undefined {
    const key = this.generateKey(config);
    return this.pendingRequests.get(key);
  }

  /**
   * Add pending request
   */
  addPending(config: AxiosRequestConfig, promise: Promise<any>): void {
    const key = this.generateKey(config);
    this.pendingRequests.set(key, promise);
  }

  /**
   * Remove pending request
   */
  removePending(config: AxiosRequestConfig): void {
    const key = this.generateKey(config);
    this.pendingRequests.delete(key);
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

// ============================================================================
// INTERCEPTOR MANAGER
// ============================================================================

export class ApiInterceptorManager {
  private axiosInstance: AxiosInstance;
  private config: Required<InterceptorConfig>;
  private pendingRequests: PendingRequestsManager;
  private requestInterceptorId?: number;
  private responseInterceptorId?: number;
  private errorInterceptorId?: number;

  constructor(axiosInstance: AxiosInstance, config: InterceptorConfig = {}) {
    this.axiosInstance = axiosInstance;
    this.config = {
      enableLogging: true,
      enableRetry: true,
      enableDeduplication: false,
      enableTiming: true,
      retryAttempts: 3,
      retryDelay: 1000,
      requestTimeout: 30000,
      ...config
    };
    this.pendingRequests = new PendingRequestsManager();
  }

  /**
   * Setup all interceptors
   */
  setupInterceptors(): void {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
    this.setupErrorInterceptor();
  }

  /**
   * Remove all interceptors
   */
  removeInterceptors(): void {
    if (this.requestInterceptorId !== undefined) {
      this.axiosInstance.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== undefined) {
      this.axiosInstance.interceptors.response.eject(this.responseInterceptorId);
    }
    if (this.errorInterceptorId !== undefined) {
      this.axiosInstance.interceptors.response.eject(this.errorInterceptorId);
    }
    this.pendingRequests.clear();
  }

  // ============================================================================
  // REQUEST INTERCEPTOR
  // ============================================================================

  private setupRequestInterceptor(): void {
    this.requestInterceptorId = this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Initialize request metadata
        const meta: RequestMeta = {
          startTime: Date.now(),
          attemptNumber: (config as any).__retryCount || 0,
          requestId: this.generateRequestId()
        };

        // Store metadata
        (config as any).__meta = meta;

        // Add request ID header
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = meta.requestId;

        // Add authentication token
        this.addAuthToken(config);

        // Add timing
        if (this.config.enableTiming) {
          config.headers['X-Request-Start'] = meta.startTime.toString();
        }

        // Request deduplication
        if (this.config.enableDeduplication && config.method?.toLowerCase() === 'get') {
          if (this.pendingRequests.hasPending(config)) {
            // Return pending request instead of making new one
            const pending = this.pendingRequests.getPending(config);
            if (pending) {
              return Promise.reject({
                __isDuplicate: true,
                promise: pending
              });
            }
          }
        }

        // Logging
        if (this.config.enableLogging) {
          this.logRequest(config, meta);
        }

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }

  // ============================================================================
  // RESPONSE INTERCEPTOR
  // ============================================================================

  private setupResponseInterceptor(): void {
    this.responseInterceptorId = this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const meta = (response.config as any).__meta as RequestMeta;

        // Calculate response time
        if (meta && this.config.enableTiming) {
          const duration = Date.now() - meta.startTime;
          response.headers['X-Response-Time'] = duration.toString();
        }

        // Remove from pending requests
        if (this.config.enableDeduplication) {
          this.pendingRequests.removePending(response.config);
        }

        // Logging
        if (this.config.enableLogging) {
          this.logResponse(response, meta);
        }

        return response;
      },
      undefined // Error handling in separate interceptor
    );
  }

  // ============================================================================
  // ERROR INTERCEPTOR
  // ============================================================================

  private setupErrorInterceptor(): void {
    this.errorInterceptorId = this.axiosInstance.interceptors.response.use(
      undefined,
      async (error: AxiosError) => {
        // Handle duplicate request
        if ((error as any).__isDuplicate) {
          return (error as any).promise;
        }

        const config = error.config as InternalAxiosRequestConfig & { __retryCount?: number; __meta?: RequestMeta };
        const meta = config?.__meta;

        // Remove from pending requests
        if (config && this.config.enableDeduplication) {
          this.pendingRequests.removePending(config);
        }

        // Transform to ApiError
        const apiError = apiErrorHandler.handleError(error, {
          endpoint: config?.url,
          method: config?.method?.toUpperCase(),
          requestId: meta?.requestId
        });

        // Logging
        if (this.config.enableLogging) {
          this.logError(apiError, meta);
        }

        // Retry logic
        if (this.config.enableRetry && config && this.shouldRetry(apiError, config)) {
          return this.retryRequest(config, apiError);
        }

        return Promise.reject(apiError);
      }
    );
  }

  // ============================================================================
  // RETRY LOGIC
  // ============================================================================

  private shouldRetry(error: ApiError, config: InternalAxiosRequestConfig & { __retryCount?: number }): boolean {
    const retryCount = config.__retryCount || 0;
    
    // Check max retry attempts
    if (retryCount >= this.config.retryAttempts) {
      return false;
    }

    // Check if error is retryable
    return apiErrorHandler.shouldRetry(error, retryCount + 1);
  }

  private async retryRequest(
    config: InternalAxiosRequestConfig & { __retryCount?: number },
    error: ApiError
  ): Promise<AxiosResponse> {
    const retryCount = (config.__retryCount || 0) + 1;
    const delay = apiErrorHandler.getRetryDelay(retryCount);

    console.log(
      `[ApiInterceptor] Retrying request (${retryCount}/${this.config.retryAttempts}) after ${delay}ms`,
      {
        endpoint: config.url,
        method: config.method,
        error: error.type
      }
    );

    // Wait before retrying
    await this.sleep(delay);

    // Update retry count
    config.__retryCount = retryCount;

    // Make new request
    return this.axiosInstance.request(config);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  private addAuthToken(config: InternalAxiosRequestConfig): void {
    // Skip if Authorization header already exists
    if (config.headers?.Authorization) {
      return;
    }

    // Get token from storage (localStorage/sessionStorage)
    const token = this.getAuthToken();
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  private getAuthToken(): string | null {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
      }
      return null;
    } catch (error) {
      console.warn('[ApiInterceptor] Failed to get auth token:', error);
      return null;
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  private logRequest(config: InternalAxiosRequestConfig, meta: RequestMeta): void {
    const logData = {
      requestId: meta.requestId,
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      attempt: meta.attemptNumber + 1
    };

    console.log('[ApiInterceptor] 📤 Request:', logData);

    // Log request body for POST/PUT/PATCH (but not sensitive data)
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
      const sanitized = this.sanitizeData(config.data);
      console.log('[ApiInterceptor] 📋 Request Body:', sanitized);
    }
  }

  private logResponse(response: AxiosResponse, meta?: RequestMeta): void {
    const duration = meta ? Date.now() - meta.startTime : 0;

    const logData = {
      requestId: meta?.requestId,
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`
    };

    console.log('[ApiInterceptor] 📥 Response:', logData);
  }

  private logError(error: ApiError, meta?: RequestMeta): void {
    const duration = meta ? Date.now() - meta.startTime : 0;

    const logData = {
      requestId: meta?.requestId || error.requestId,
      method: error.method,
      url: error.endpoint,
      type: error.type,
      status: error.statusCode,
      message: error.message,
      duration: `${duration}ms`,
      retryable: error.retryable
    };

    console.error('[ApiInterceptor] ❌ Error:', logData);
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      
      Object.keys(sanitized).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          sanitized[key] = '***REDACTED***';
        }
      });
      
      return sanitized;
    }
    
    return data;
  }

  /**
   * Update interceptor configuration
   */
  updateConfig(config: Partial<InterceptorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<InterceptorConfig> {
    return { ...this.config };
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Setup interceptors for axios instance
 */
export const setupInterceptors = (
  axiosInstance: AxiosInstance,
  config?: InterceptorConfig
): ApiInterceptorManager => {
  const manager = new ApiInterceptorManager(axiosInstance, config);
  manager.setupInterceptors();
  return manager;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ApiInterceptorManager;