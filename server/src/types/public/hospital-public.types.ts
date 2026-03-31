import { Types } from "mongoose";

/**
 * Public Hospital Type
 * EXACT MATCH with client's HospitalPublic
 */
export interface HospitalPublic {
  id: string;
  name: string;
  city: string;
  address?: string;
  departments?: string[];
  rating?: number;
  reviewsCount?: number;
  logoUrl?: string;
  isEmergencyAvailable?: boolean;
}

/**
 * Paginated Response
 * EXACT MATCH with client's HospitalPublicListResponse
 */
export interface HospitalPublicListResponse {
  items: HospitalPublic[];
  total: number;
}

/**
 * Internal Hospital Query
 */
export interface HospitalQueryFilter {
  isActive: boolean;
  status: string;
  "address.city"?: RegExp;
}

/**
 * Hospital Profile (Extended)
 */
export interface HospitalPublicProfile extends HospitalPublic {
  about?: string;
  establishedYear?: number;
  facilities?: string[];
  visitingHours?: string;
  doctors?: {
    id: string;
    name: string;
    speciality: string;
  }[];
}