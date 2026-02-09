// src/types/public/hospital-public.types.ts

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

export interface HospitalPublicListResponse {
  items: HospitalPublic[];
  total: number;
}
