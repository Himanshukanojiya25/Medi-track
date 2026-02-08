/**
 * Standard API error object
 */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

/**
 * Error response wrapper
 */
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: ApiError;
}
