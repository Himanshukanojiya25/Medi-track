/**
 * Pagination request parameters
 */
export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
}

/**
 * Pagination metadata in response
 */
export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly pagination: PaginationMeta;
}
