// src/services/public/public-search.api.ts

import { httpClient } from "../api/http.client";

export type PublicSearchResponse = {
  doctors: unknown[];
  hospitals: unknown[];
};

export const publicSearchApi = {
  async search(query: string) {
    const res = await httpClient.get<PublicSearchResponse>("/public/search", {
      params: { q: query },
    });
    return res.data;
  },
};
