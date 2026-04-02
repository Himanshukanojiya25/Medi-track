// client/src/types/index.ts

// Foundation
export * from "./shared";
export * from "./role";
export * from "./auth";

// Core domains - Use export * but with explicit re-exports for conflicting ones
export * from "./doctor";
export * from "./hospital";
export * from "./patient";
export * from "./appointment";
export * from "./prescription";
export * from "./billing";

// System & scale
export * from "./system";
export * from "./analytics";
export * from "./notification";
export * from "./subscription";

// AI & UI support
export * from "./ai";
export * from "./ui";

// API types - export as API namespace to avoid conflicts
import * as API from "./api";
export { API };

// Also export commonly used API types directly
export type { 
  ApiResponse, 
  PaginationParams, 
  PaginatedResponse,
  QueryParams 
} from "./api";