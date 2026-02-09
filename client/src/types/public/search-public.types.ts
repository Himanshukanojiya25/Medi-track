// src/types/public/search-public.types.ts

import { DoctorPublic } from "./doctor-public.types";
import { HospitalPublic } from "./hospital-public.types";

export type PublicSearchEntityType = "doctor" | "hospital";

export interface PublicSearchParams {
  query?: string;
  location?: string;
  speciality?: string;
  page?: number;
  limit?: number;
}

export interface PublicSearchResult {
  doctors: DoctorPublic[];
  hospitals: HospitalPublic[];
}
