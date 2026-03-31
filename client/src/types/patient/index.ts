// Export all patient types
export * from './patient.types';
export * from './medical-history.types';
export * from './upload.types';

// Re-export shared types
export type { ID, ISODateString, Timestamps } from '../shared';

// Define pagination types locally
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  statusCode?: number;
  timestamp?: string;
}

export interface QueryParams extends PaginationParams {
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}