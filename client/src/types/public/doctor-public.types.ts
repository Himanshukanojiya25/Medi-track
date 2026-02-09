// src/types/public/doctor-public.types.ts

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

export interface DoctorPublicListResponse {
  items: DoctorPublic[];
  total: number;
}
