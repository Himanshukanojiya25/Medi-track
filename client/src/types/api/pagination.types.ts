// src/types/api/pagination.types.ts

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination metadata in response
 */
export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPrevPage: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly pagination: PaginationMeta;
}

/**
 * Extended query parameters with search and filters
 */
export interface QueryParams extends PaginationParams {
  readonly search?: string;
  readonly status?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
}