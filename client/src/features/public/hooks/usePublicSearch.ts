// src/features/public/hooks/usePublicSearch.ts

import { useState } from "react";
import { searchPublic } from "../services/public-search.service";
import { normalizePublicSearchResult } from "../utils/normalize-public-search.util";
import {
  PublicSearchParams,
  PublicSearchResult,
} from "../../../types/public/search-public.types";

export function usePublicSearch() {
  const [data, setData] = useState<PublicSearchResult>({
    doctors: [],
    hospitals: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function search(params: PublicSearchParams) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await searchPublic(params);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    raw: data,
    items: normalizePublicSearchResult(data),
    isLoading,
    error,
    search,
  };
}
