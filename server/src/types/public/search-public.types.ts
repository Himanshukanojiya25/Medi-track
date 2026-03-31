import { DoctorPublic } from "./doctor-public.types";
import { HospitalPublic } from "./hospital-public.types";

/**
 * Search Parameters
 * EXACT MATCH with client
 */
export interface PublicSearchParams {
  query?: string;
  location?: string;
  speciality?: string;
  page?: number;
  limit?: number;
}

/**
 * Search Result
 * EXACT MATCH with client
 */
export interface PublicSearchResult {
  doctors: DoctorPublic[];
  hospitals: HospitalPublic[];
}

/**
 * Internal Search Query
 */
export interface SearchQuery {
  q?: string;
  location?: string;
  speciality?: string;
  page?: number;
  limit?: number;
}