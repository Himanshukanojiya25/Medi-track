// client/src/features/patient/services/favorite.service.ts

import { httpClient } from '../../../services/api/http.client';
import type { Doctor } from '../../../types/patient/doctor.types';
import type { Hospital } from '../../../types/patient/hospital.types';
import type { ID } from '../../../types/shared';

// ============================================================================
// TYPES
// ============================================================================

export interface FavouriteItem {
  readonly id: ID;
  readonly patientId: ID;
  readonly entityId: ID;
  readonly entityType: 'DOCTOR' | 'HOSPITAL';
  readonly createdAt: string;
}

export interface FavouriteDoctorsResponse {
  success: boolean;
  data: Doctor[];
}

export interface FavouriteHospitalsResponse {
  success: boolean;
  data: Hospital[];
}

export interface FavouriteStatusResponse {
  success: boolean;
  data: { isFavourite: boolean };
}

// ============================================================================
// SERVICE
// ============================================================================

const PATIENT_BASE = '/api/v1/patients/me';

export const favoriteService = {

  // ── DOCTORS ─────────────────────────────────────────────────────────────────

  /**
   * Get all favourite doctors for the logged-in patient
   * GET /api/v1/patients/me/favourite-doctors
   */
  getFavouriteDoctors: async (): Promise<Doctor[]> => {
    const response = await httpClient.get<FavouriteDoctorsResponse>(
      `${PATIENT_BASE}/favourite-doctors`,
    );
    return response.data.data;
  },

  /**
   * Add a doctor to favourites
   * POST /api/v1/patients/me/favourite-doctors/:doctorId
   */
  addFavouriteDoctor: async (doctorId: ID): Promise<void> => {
    await httpClient.post(`${PATIENT_BASE}/favourite-doctors/${doctorId}`);
  },

  /**
   * Remove a doctor from favourites
   * DELETE /api/v1/patients/me/favourite-doctors/:doctorId
   */
  removeFavouriteDoctor: async (doctorId: ID): Promise<void> => {
    await httpClient.delete(`${PATIENT_BASE}/favourite-doctors/${doctorId}`);
  },

  /**
   * Check if a doctor is a favourite
   * GET /api/v1/patients/me/favourite-doctors/:doctorId/status
   */
  isDoctorFavourite: async (doctorId: ID): Promise<boolean> => {
    const response = await httpClient.get<FavouriteStatusResponse>(
      `${PATIENT_BASE}/favourite-doctors/${doctorId}/status`,
    );
    return response.data.data.isFavourite;
  },

  /**
   * Toggle doctor favourite status
   */
  toggleFavouriteDoctor: async (
    doctorId: ID,
    currentlyFavourite: boolean,
  ): Promise<void> => {
    if (currentlyFavourite) {
      await favoriteService.removeFavouriteDoctor(doctorId);
    } else {
      await favoriteService.addFavouriteDoctor(doctorId);
    }
  },

  // ── HOSPITALS ───────────────────────────────────────────────────────────────

  /**
   * Get all favourite hospitals for the logged-in patient
   * GET /api/v1/patients/me/favourite-hospitals
   */
  getFavouriteHospitals: async (): Promise<Hospital[]> => {
    const response = await httpClient.get<FavouriteHospitalsResponse>(
      `${PATIENT_BASE}/favourite-hospitals`,
    );
    return response.data.data;
  },

  /**
   * Add a hospital to favourites
   * POST /api/v1/patients/me/favourite-hospitals/:hospitalId
   */
  addFavouriteHospital: async (hospitalId: ID): Promise<void> => {
    await httpClient.post(`${PATIENT_BASE}/favourite-hospitals/${hospitalId}`);
  },

  /**
   * Remove a hospital from favourites
   * DELETE /api/v1/patients/me/favourite-hospitals/:hospitalId
   */
  removeFavouriteHospital: async (hospitalId: ID): Promise<void> => {
    await httpClient.delete(
      `${PATIENT_BASE}/favourite-hospitals/${hospitalId}`,
    );
  },

  /**
   * Check if a hospital is a favourite
   * GET /api/v1/patients/me/favourite-hospitals/:hospitalId/status
   */
  isHospitalFavourite: async (hospitalId: ID): Promise<boolean> => {
    const response = await httpClient.get<FavouriteStatusResponse>(
      `${PATIENT_BASE}/favourite-hospitals/${hospitalId}/status`,
    );
    return response.data.data.isFavourite;
  },

  /**
   * Toggle hospital favourite status
   */
  toggleFavouriteHospital: async (
    hospitalId: ID,
    currentlyFavourite: boolean,
  ): Promise<void> => {
    if (currentlyFavourite) {
      await favoriteService.removeFavouriteHospital(hospitalId);
    } else {
      await favoriteService.addFavouriteHospital(hospitalId);
    }
  },

} as const;

export default favoriteService;