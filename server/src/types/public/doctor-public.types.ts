import { Types } from "mongoose";

/**
 * Public Doctor Type
 * EXACT MATCH with client's DoctorPublic
 */
export interface DoctorPublic {
  id: string;
  name: string;
  speciality: string;
  experienceYears: number;
  rating?: number;
  reviewsCount?: number;
  consultationFee?: number;
  hospital?: {
    id: string;
    name: string;
    city?: string;
  };
  avatarUrl?: string;
  isAvailableToday?: boolean;
}

/**
 * Paginated Response
 * EXACT MATCH with client's DoctorPublicListResponse
 */
export interface DoctorPublicListResponse {
  items: DoctorPublic[];
  total: number;
}

/**
 * Internal Doctor Query (with MongoDB fields)
 */
export interface DoctorQueryFilter {
  isActive: boolean;
  status: string;
  specialization?: RegExp;
  hospitalId?: Types.ObjectId;
}

/**
 * Doctor Profile (Extended for detail page)
 */
export interface DoctorPublicProfile extends DoctorPublic {
  about?: string;
  qualifications?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  languages?: string[];
  experience?: {
    hospital: string;
    position: string;
    from: number;
    to?: number;
  }[];
  availabilitySlots?: {
    date: string;
    slots: string[];
  }[];
}