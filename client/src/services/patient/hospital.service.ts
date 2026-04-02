// client/src/services/patient/hospital.service.ts

import { createApiClient } from '../../lib/api/http.client';
import { apiConfig } from '../../app/config/api.config';
import type { PaginatedResponse } from '../../lib/api/http.client';
import type { ID } from '../../types/shared';
import type { 
  Hospital, 
  HospitalFilters, 
  HospitalProfile,
  HospitalDepartment,
  HospitalFacility,
  HospitalReview,
  HospitalRating
} from '../../types/patient';

// API endpoints
const HOSPITAL_ENDPOINTS = {
  BASE: '/hospitals',
  DETAILS: (id: string) => `/hospitals/${id}`,
  PROFILE: (id: string) => `/hospitals/${id}/profile`,
  DEPARTMENTS: (id: string) => `/hospitals/${id}/departments`,
  FACILITIES: (id: string) => `/hospitals/${id}/facilities`,
  DOCTORS: (id: string) => `/hospitals/${id}/doctors`,
  REVIEWS: (id: string) => `/hospitals/${id}/reviews`,
  RATING: (id: string) => `/hospitals/${id}/rating`,
  NEARBY: '/hospitals/nearby',
  TOP_HOSPITALS: '/hospitals/top',
  CITIES: '/hospitals/cities',
};

class HospitalService {
  private client = createApiClient(apiConfig.get().baseURL, {
    timeout: apiConfig.get().timeoutMs,
    withCredentials: apiConfig.get().withCredentials,
  });

  /**
   * Get all hospitals with filters
   */
  async getHospitals(
    filters?: HospitalFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Hospital>> {
    try {
      const response = await this.client.getPaginated<Hospital>(
        HOSPITAL_ENDPOINTS.BASE,
        page,
        limit,
        filters as Record<string, unknown>
      );
      return response;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospitals:', error);
      throw error;
    }
  }

  /**
   * Get hospital details by ID
   */
  async getHospitalById(id: ID): Promise<Hospital> {
    try {
      const response = await this.client.get<Hospital>(
        HOSPITAL_ENDPOINTS.DETAILS(id)
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital details:', error);
      throw error;
    }
  }

  /**
   * Get hospital profile with complete details
   */
  async getHospitalProfile(id: ID): Promise<HospitalProfile> {
    try {
      const response = await this.client.get<HospitalProfile>(
        HOSPITAL_ENDPOINTS.PROFILE(id)
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital profile:', error);
      throw error;
    }
  }

  /**
   * Get hospital departments
   */
  async getHospitalDepartments(hospitalId: ID): Promise<HospitalDepartment[]> {
    try {
      const response = await this.client.get<HospitalDepartment[]>(
        HOSPITAL_ENDPOINTS.DEPARTMENTS(hospitalId)
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital departments:', error);
      throw error;
    }
  }

  /**
   * Get hospital facilities
   */
  async getHospitalFacilities(hospitalId: ID): Promise<HospitalFacility[]> {
    try {
      const response = await this.client.get<HospitalFacility[]>(
        HOSPITAL_ENDPOINTS.FACILITIES(hospitalId)
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital facilities:', error);
      throw error;
    }
  }

  /**
   * Get doctors in hospital
   */
  async getHospitalDoctors(
    hospitalId: ID,
    speciality?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    try {
      const response = await this.client.getPaginated<any>(
        HOSPITAL_ENDPOINTS.DOCTORS(hospitalId),
        page,
        limit,
        { speciality }
      );
      return response;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital doctors:', error);
      throw error;
    }
  }

  /**
   * Get hospital reviews
   */
  async getHospitalReviews(
    hospitalId: ID,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<HospitalReview>> {
    try {
      const response = await this.client.getPaginated<HospitalReview>(
        HOSPITAL_ENDPOINTS.REVIEWS(hospitalId),
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital reviews:', error);
      throw error;
    }
  }

  /**
   * Submit review for hospital
   */
  async submitReview(
    hospitalId: ID,
    data: {
      rating: number;
      review: string;
      tags?: string[];
    }
  ): Promise<HospitalReview> {
    try {
      const response = await this.client.post<HospitalReview>(
        HOSPITAL_ENDPOINTS.REVIEWS(hospitalId),
        data
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error submitting review:', error);
      throw error;
    }
  }

  /**
   * Get hospital rating
   */
  async getHospitalRating(hospitalId: ID): Promise<HospitalRating> {
    try {
      const response = await this.client.get<HospitalRating>(
        HOSPITAL_ENDPOINTS.RATING(hospitalId)
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching hospital rating:', error);
      throw error;
    }
  }

  /**
   * Get nearby hospitals based on location
   */
  async getNearbyHospitals(
    lat: number,
    lng: number,
    radius: number = 10, // in km
    filters?: HospitalFilters
  ): Promise<Hospital[]> {
    try {
      const response = await this.client.get<Hospital[]>(
        HOSPITAL_ENDPOINTS.NEARBY,
        { params: { lat, lng, radius, ...filters } }
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching nearby hospitals:', error);
      throw error;
    }
  }

  /**
   * Get top hospitals by rating
   */
  async getTopHospitals(limit: number = 10): Promise<Hospital[]> {
    try {
      const response = await this.client.get<Hospital[]>(
        HOSPITAL_ENDPOINTS.TOP_HOSPITALS,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching top hospitals:', error);
      throw error;
    }
  }

  /**
   * Get all cities with hospitals
   */
  async getCities(): Promise<string[]> {
    try {
      const response = await this.client.get<string[]>(
        HOSPITAL_ENDPOINTS.CITIES
      );
      return response.data;
    } catch (error) {
      console.error('[HospitalService] Error fetching cities:', error);
      throw error;
    }
  }

  /**
   * Search hospitals by name, city, or specialty
   */
  async searchHospitals(
    query: string,
    filters?: HospitalFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Hospital>> {
    try {
      const response = await this.client.getPaginated<Hospital>(
        `${HOSPITAL_ENDPOINTS.BASE}/search`,
        page,
        limit,
        { query, ...filters }
      );
      return response;
    } catch (error) {
      console.error('[HospitalService] Error searching hospitals:', error);
      throw error;
    }
  }
}

// Singleton instance
export const hospitalService = new HospitalService();

export { HospitalService };