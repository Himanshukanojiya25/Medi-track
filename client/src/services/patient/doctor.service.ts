// client/src/services/patient/doctor.service.ts

import { createApiClient } from '../../lib/api/http.client';
import { apiConfig } from '../../app/config/api.config';
import type { PaginatedResponse } from '../../lib/api/http.client';
import type { ID } from '../../types/shared';
import type { 
  Doctor, 
  DoctorFilters, 
  DoctorProfile,
  DoctorReview,
  DoctorAvailability,
  DoctorRating
} from '../../types/patient';

// API endpoints
const DOCTOR_ENDPOINTS = {
  BASE: '/doctors',
  DETAILS: (id: string) => `/doctors/${id}`,
  PROFILE: (id: string) => `/doctors/${id}/profile`,
  REVIEWS: (id: string) => `/doctors/${id}/reviews`,
  AVAILABILITY: (id: string) => `/doctors/${id}/availability`,
  RATING: (id: string) => `/doctors/${id}/rating`,
  SPECIALITIES: '/doctors/specialities',
  DEPARTMENTS: '/doctors/departments',
  TOP_DOCTORS: '/doctors/top',
  NEARBY: '/doctors/nearby',
};

class DoctorService {
  private client = createApiClient(apiConfig.get().baseURL, {
    timeout: apiConfig.get().timeoutMs,
    withCredentials: apiConfig.get().withCredentials,
  });

  /**
   * Get all doctors with filters
   */
  async getDoctors(
    filters?: DoctorFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Doctor>> {
    try {
      const response = await this.client.getPaginated<Doctor>(
        DOCTOR_ENDPOINTS.BASE,
        page,
        limit,
        filters as Record<string, unknown>
      );
      return response;
    } catch (error) {
      console.error('[DoctorService] Error fetching doctors:', error);
      throw error;
    }
  }

  /**
   * Get doctor details by ID
   */
  async getDoctorById(id: ID): Promise<Doctor> {
    try {
      const response = await this.client.get<Doctor>(
        DOCTOR_ENDPOINTS.DETAILS(id)
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching doctor details:', error);
      throw error;
    }
  }

  /**
   * Get doctor profile with complete details
   */
  async getDoctorProfile(id: ID): Promise<DoctorProfile> {
    try {
      const response = await this.client.get<DoctorProfile>(
        DOCTOR_ENDPOINTS.PROFILE(id)
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching doctor profile:', error);
      throw error;
    }
  }

  /**
   * Get doctor reviews
   */
  async getDoctorReviews(
    doctorId: ID,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<DoctorReview>> {
    try {
      const response = await this.client.getPaginated<DoctorReview>(
        DOCTOR_ENDPOINTS.REVIEWS(doctorId),
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error('[DoctorService] Error fetching doctor reviews:', error);
      throw error;
    }
  }

  /**
   * Submit review for doctor
   */
  async submitReview(
    doctorId: ID,
    data: {
      rating: number;
      review: string;
      appointmentId?: ID;
      tags?: string[];
    }
  ): Promise<DoctorReview> {
    try {
      const response = await this.client.post<DoctorReview>(
        DOCTOR_ENDPOINTS.REVIEWS(doctorId),
        data
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error submitting review:', error);
      throw error;
    }
  }

  /**
   * Get doctor availability
   */
  async getDoctorAvailability(
    doctorId: ID,
    date?: string
  ): Promise<DoctorAvailability> {
    try {
      const response = await this.client.get<DoctorAvailability>(
        DOCTOR_ENDPOINTS.AVAILABILITY(doctorId),
        { params: { date } }
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching doctor availability:', error);
      throw error;
    }
  }

  /**
   * Get doctor rating
   */
  async getDoctorRating(doctorId: ID): Promise<DoctorRating> {
    try {
      const response = await this.client.get<DoctorRating>(
        DOCTOR_ENDPOINTS.RATING(doctorId)
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching doctor rating:', error);
      throw error;
    }
  }

  /**
   * Get all specialities
   */
  async getSpecialities(): Promise<{ id: string; name: string; count: number }[]> {
    try {
      const response = await this.client.get<{ id: string; name: string; count: number }[]>(
        DOCTOR_ENDPOINTS.SPECIALITIES
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching specialities:', error);
      throw error;
    }
  }

  /**
   * Get all departments
   */
  async getDepartments(): Promise<{ id: string; name: string; description?: string }[]> {
    try {
      const response = await this.client.get<{ id: string; name: string; description?: string }[]>(
        DOCTOR_ENDPOINTS.DEPARTMENTS
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching departments:', error);
      throw error;
    }
  }

  /**
   * Get top doctors by rating or specialization
   */
  async getTopDoctors(
    speciality?: string,
    limit: number = 10
  ): Promise<Doctor[]> {
    try {
      const response = await this.client.get<Doctor[]>(
        DOCTOR_ENDPOINTS.TOP_DOCTORS,
        { params: { speciality, limit } }
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching top doctors:', error);
      throw error;
    }
  }

  /**
   * Get nearby doctors based on location
   */
  async getNearbyDoctors(
    lat: number,
    lng: number,
    radius: number = 10, // in km
    filters?: DoctorFilters
  ): Promise<Doctor[]> {
    try {
      const response = await this.client.get<Doctor[]>(
        DOCTOR_ENDPOINTS.NEARBY,
        { params: { lat, lng, radius, ...filters } }
      );
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Error fetching nearby doctors:', error);
      throw error;
    }
  }

  /**
   * Search doctors by name, speciality, or hospital
   */
  async searchDoctors(
    query: string,
    filters?: DoctorFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Doctor>> {
    try {
      const response = await this.client.getPaginated<Doctor>(
        `${DOCTOR_ENDPOINTS.BASE}/search`,
        page,
        limit,
        { query, ...filters }
      );
      return response;
    } catch (error) {
      console.error('[DoctorService] Error searching doctors:', error);
      throw error;
    }
  }
}

// Singleton instance
export const doctorService = new DoctorService();

export { DoctorService };