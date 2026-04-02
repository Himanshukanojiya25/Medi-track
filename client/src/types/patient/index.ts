// client/src/types/patient/index.ts

// Export patient-specific types only
export * from './patient.types';
export * from './medical-history.types';
export * from './upload.types';

// DO NOT export doctor.types and hospital.types from here
// They are already exported from main doctor and hospital modules
// This was causing the conflict with ./doctor and ./hospital exports
// export * from './doctor.types';  // REMOVE THIS LINE
// export * from './hospital.types'; // REMOVE THIS LINE

// Re-export shared types
export type { ID, ISODateString, Timestamps } from '../shared';

// DO NOT define pagination types locally - they come from API module
// This was causing conflict with ./api exports
// Remove these local definitions:

// export interface PaginationParams { ... }  // REMOVE
// export interface PaginatedResponse<T> { ... } // REMOVE
// export interface ApiResponse<T> { ... } // REMOVE
// export interface QueryParams extends PaginationParams { ... } // REMOVE

// Instead, re-export them from api module
export type { 
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  QueryParams 
} from '../api';

// DO NOT export appointment types from here
// Appointment types should be imported directly from '../appointment'