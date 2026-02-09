// src/features/public/hooks/usePublicDoctors.ts

import { useEffect, useState } from "react";
import {
  getPublicDoctors,
  getPublicDoctorById,
} from "../services/public-doctor.service";
import {
  DoctorPublic,
  DoctorPublicListResponse,
} from "../../../types/public/doctor-public.types";

export function usePublicDoctors() {
  const [data, setData] = useState<DoctorPublicListResponse>({
    items: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadDoctors();
    // Phase 1.0: auto load once
  }, []);

  async function loadDoctors() {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getPublicDoctors();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getDoctorById(id: string): Promise<DoctorPublic | null> {
    return getPublicDoctorById(id);
  }

  return {
    doctors: data.items,
    total: data.total,
    isLoading,
    error,
    reload: loadDoctors,
    getDoctorById,
  };
}
