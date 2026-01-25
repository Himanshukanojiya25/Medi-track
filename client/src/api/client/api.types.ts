// client/src/api/client/api.types.ts

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

/**
 * Pagination (list APIs ke liye – future use)
 */
export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
