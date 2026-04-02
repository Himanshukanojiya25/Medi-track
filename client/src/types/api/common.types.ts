// src/types/api/common.types.ts

/**
 * Generic API metadata
 * Used for tracing & observability
 */
export interface ApiMeta {
  readonly requestId?: string;
  readonly timestamp: string; // ISO 8601
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}