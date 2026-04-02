// src/types/api/common-response.types.ts

import type { ApiMeta } from "./common.types";

/**
 * Standard successful API response
 */
export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: ApiMeta;
}

/**
 * Standard error API response
 */
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: {
    code: string;
    message: string;
    details?: Array<{
      field?: string;
      message: string;
    }>;
  };
  readonly meta?: ApiMeta;
}

/**
 * Generic API response (success or error)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;