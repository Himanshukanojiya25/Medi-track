// src/features/public/utils/normalize-public-search.util.ts

import { DoctorPublic } from "../../../types/public/doctor-public.types";
import { HospitalPublic } from "../../../types/public/hospital-public.types";

export type PublicSearchItem =
  | ({ type: "doctor" } & DoctorPublic)
  | ({ type: "hospital" } & HospitalPublic);

export function normalizePublicSearchResult(input: {
  doctors?: DoctorPublic[];
  hospitals?: HospitalPublic[];
}): PublicSearchItem[] {
  const doctors =
    input.doctors?.map((d) => ({
      type: "doctor" as const,
      ...d,
    })) ?? [];

  const hospitals =
    input.hospitals?.map((h) => ({
      type: "hospital" as const,
      ...h,
    })) ?? [];

  return [...doctors, ...hospitals];
}
