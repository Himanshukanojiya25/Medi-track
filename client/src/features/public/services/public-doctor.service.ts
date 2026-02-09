// src/features/public/services/public-doctor.service.ts

import {
  DoctorPublic,
  DoctorPublicListResponse,
} from "../../../types/public/doctor-public.types";

export async function getPublicDoctors(): Promise<DoctorPublicListResponse> {
  return {
    items: [],
    total: 0,
  };
}

export async function getPublicDoctorById(
  _doctorId: string
): Promise<DoctorPublic | null> {
  return null;
}
