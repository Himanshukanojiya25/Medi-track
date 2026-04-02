// src/types/api/index.ts

// Generic infra
export * from "./common.types";

// Success / error contracts
export * from "./common-response.types";
export * from "./error.types";

// Pagination
export * from "./pagination.types";

// Explicitly re-export commonly used types
export type { 
  ApiResponse, 
  ApiSuccessResponse, 
  ApiErrorResponse 
} from "./common-response.types";

export type { 
  PaginationParams, 
  PaginationMeta, 
  PaginatedResponse,
  QueryParams 
} from "./pagination.types";c