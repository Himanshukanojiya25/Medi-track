// src/features/public/services/public-search.service.ts

import {
  PublicSearchParams,
  PublicSearchResult,
} from "../../../types/public/search-public.types";

/**
 * Phase 1.0:
 * - Mocked / empty implementation
 * Phase 1.1:
 * - Hybrid backend (cached + realtime)
 */
export async function searchPublic(
  _params: PublicSearchParams
): Promise<PublicSearchResult> {
  return {
    doctors: [],
    hospitals: [],
  };
}
