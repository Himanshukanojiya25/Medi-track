// src/features/public/hooks/usePublicHospitals.ts

import { useEffect, useState } from "react";
import {
  getPublicHospitals,
  getPublicHospitalById,
} from "../services/public-hospital.service";
import {
  HospitalPublic,
  HospitalPublicListResponse,
} from "../../../types/public/hospital-public.types";

export function usePublicHospitals() {
  const [data, setData] = useState<HospitalPublicListResponse>({
    items: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadHospitals();
  }, []);

  async function loadHospitals() {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getPublicHospitals();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getHospitalById(
    id: string
  ): Promise<HospitalPublic | null> {
    return getPublicHospitalById(id);
  }

  return {
    hospitals: data.items,
    total: data.total,
    isLoading,
    error,
    reload: loadHospitals,
    getHospitalById,
  };
}