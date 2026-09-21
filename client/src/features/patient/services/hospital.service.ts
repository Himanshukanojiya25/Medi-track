// client/src/features/patient/services/hospital.service.ts

import { httpClient } from '../../../services/api/http.client';
import type {
  Hospital,
  HospitalFilters,
  HospitalProfile,
  HospitalReview,
} from '../../../types/patient/hospital.types';
import type { ID } from '../../../types/shared';

// ============================================================================
// TYPES
// ============================================================================

export interface HospitalListParams extends HospitalFilters {
  page?: number;
  limit?: number;
}

export interface HospitalListResponse {
  success: boolean;
  data: Hospital[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface HospitalResponse {
  success: boolean;
  data: Hospital;
  message?: string;
}

export interface HospitalProfileResponse {
  success: boolean;
  data: HospitalProfile;
  message?: string;
}

export interface HospitalReviewsResponse {
  success: boolean;
  data: HospitalReview[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// SERVICE
// ============================================================================

const API_BASE = '/api/v1/hospitals';

export const hospitalService = {

  /**
   * List hospitals with filters
   * GET /api/v1/hospitals
   */
  list: async (params?: HospitalListParams): Promise<HospitalListResponse> => {
    const response = await httpClient.get<HospitalListResponse>(API_BASE, { params });
    return response.data;
  },

  /**
   * Get hospital by ID
   * GET /api/v1/hospitals/:id
   */
  getById: async (id: ID): Promise<Hospital> => {
    const response = await httpClient.get<HospitalResponse>(`${API_BASE}/${id}`);
    return response.data.data;
  },

  /**
   * Get full hospital profile (with doctors, reviews, stats)
   * GET /api/v1/hospitals/:id/profile
   */
  getProfile: async (id: ID): Promise<HospitalProfile> => {
    const response = await httpClient.get<HospitalProfileResponse>(
      `${API_BASE}/${id}/profile`,
    );
    return response.data.data;
  },

  /**
   * Get hospital reviews
   * GET /api/v1/hospitals/:id/reviews
   */
  getReviews: async (
    id: ID,
    params?: { page?: number; limit?: number },
  ): Promise<HospitalReviewsResponse> => {
    const response = await httpClient.get<HospitalReviewsResponse>(
      `${API_BASE}/${id}/reviews`,
      { params },
    );
    return response.data;
  },

  /**
   * Get doctors in a hospital
   * GET /api/v1/hospitals/:id/doctors
   */
  getDoctors: async (
    id: ID,
    params?: { specialization?: string; page?: number; limit?: number },
  ): Promise<{ success: boolean; data: any[] }> => {
    const response = await httpClient.get(`${API_BASE}/${id}/doctors`, { params });
    return response.data;
  },

  /**
   * Get departments of a hospital
   * GET /api/v1/hospitals/:id/departments
   */
  getDepartments: async (id: ID): Promise<{ success: boolean; data: any[] }> => {
    const response = await httpClient.get(`${API_BASE}/${id}/departments`);
    return response.data;
  },

  /**
   * Get patient's favourite hospitals
   * GET /api/v1/patients/me/favourite-hospitals
   */
  getFavourites: async (): Promise<Hospital[]> => {
    const response = await httpClient.get<{ success: boolean; data: Hospital[] }>(
      '/api/v1/patients/me/favourite-hospitals',
    );
    return response.data.data;
  },

  /**
   * Add hospital to favourites
   * POST /api/v1/patients/me/favourite-hospitals/:hospitalId
   */
  addFavourite: async (hospitalId: ID): Promise<void> => {
    await httpClient.post(`/api/v1/patients/me/favourite-hospitals/${hospitalId}`);
  },

  /**
   * Remove hospital from favourites
   * DELETE /api/v1/patients/me/favourite-hospitals/:hospitalId
   */
  removeFavourite: async (hospitalId: ID): Promise<void> => {
    await httpClient.delete(
      `/api/v1/patients/me/favourite-hospitals/${hospitalId}`,
    );
  },

  /**
   * Toggle favourite status
   */
  toggleFavourite: async (
    hospitalId: ID,
    currentlyFavourite: boolean,
  ): Promise<void> => {
    if (currentlyFavourite) {
      await hospitalService.removeFavourite(hospitalId);
    } else {
      await hospitalService.addFavourite(hospitalId);
    }
  },

} as const;

export default hospitalService;