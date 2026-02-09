// src/features/public/services/public-hospital.service.ts

import {
  HospitalPublic,
  HospitalPublicListResponse,
} from "../../../types/public/hospital-public.types";

export async function getPublicHospitals(): Promise<HospitalPublicListResponse> {
  return {
    items: [],
    total: 0,
  };
}

export async function getPublicHospitalById(
  _hospitalId: string
): Promise<HospitalPublic | null> {
  return null;
}
