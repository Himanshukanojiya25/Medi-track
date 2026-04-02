// client/src/services/patient/appointment.service.ts

import { createApiClient } from '../../lib/api/http.client';
import { apiConfig } from '../../app/config/api.config';
import type { PaginatedResponse } from '../../lib/api/http.client';
import type { ID, ISODateString } from '../../types/shared';
import type { 
  Appointment, 
  AppointmentStatus,
  AppointmentType,
  PaymentStatus,
  BookAppointmentPayload,
  RescheduleAppointmentPayload,
  CancelAppointmentPayload,
  AppointmentFilters,
  AppointmentStatistics,
  TodayAppointment
} from '../../types/patient';

// API endpoints
const APPOINTMENT_ENDPOINTS = {
  BASE: '/appointments',
  BOOK: '/appointments/book',
  HISTORY: '/appointments/history',
  UPCOMING: '/appointments/upcoming',
  TODAY: '/appointments/today',
  DETAILS: (id: string) => `/appointments/${id}`,
  CANCEL: (id: string) => `/appointments/${id}/cancel`,
  RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
  CONFIRM: (id: string) => `/appointments/${id}/confirm`,
  COMPLETE: (id: string) => `/appointments/${id}/complete`,
  NO_SHOW: (id: string) => `/appointments/${id}/no-show`,
  STATS: '/appointments/stats',
  CHECK_AVAILABILITY: '/appointments/check-availability',
  AVAILABLE_SLOTS: '/appointments/available-slots',
};

class AppointmentService {
  private client = createApiClient(apiConfig.get().baseURL, {
    timeout: apiConfig.get().timeoutMs,
    withCredentials: apiConfig.get().withCredentials,
  });

  /**
   * Book a new appointment
   */
  async bookAppointment(data: BookAppointmentPayload): Promise<Appointment> {
    try {
      const response = await this.client.post<Appointment>(
        APPOINTMENT_ENDPOINTS.BOOK,
        data
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error booking appointment:', error);
      throw error;
    }
  }

  /**
   * Get all appointments with filters
   */
  async getAppointments(
    filters?: AppointmentFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Appointment>> {
    try {
      const response = await this.client.getPaginated<Appointment>(
        APPOINTMENT_ENDPOINTS.BASE,
        page,
        limit,
        filters as Record<string, unknown>
      );
      return response;
    } catch (error) {
      console.error('[AppointmentService] Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Get appointment history (completed/cancelled appointments)
   */
  async getAppointmentHistory(
    page: number = 1,
    limit: number = 10,
    filters?: { fromDate?: ISODateString; toDate?: ISODateString }
  ): Promise<PaginatedResponse<Appointment>> {
    try {
      const response = await this.client.getPaginated<Appointment>(
        APPOINTMENT_ENDPOINTS.HISTORY,
        page,
        limit,
        filters as Record<string, unknown>
      );
      return response;
    } catch (error) {
      console.error('[AppointmentService] Error fetching appointment history:', error);
      throw error;
    }
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(limit: number = 5): Promise<Appointment[]> {
    try {
      const response = await this.client.get<Appointment[]>(
        APPOINTMENT_ENDPOINTS.UPCOMING,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error fetching upcoming appointments:', error);
      throw error;
    }
  }

  /**
   * Get today's appointments
   */
  async getTodayAppointments(): Promise<TodayAppointment[]> {
    try {
      const response = await this.client.get<TodayAppointment[]>(
        APPOINTMENT_ENDPOINTS.TODAY
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error fetching today appointments:', error);
      throw error;
    }
  }

  /**
   * Get appointment details by ID
   */
  async getAppointmentById(id: ID): Promise<Appointment> {
    try {
      const response = await this.client.get<Appointment>(
        APPOINTMENT_ENDPOINTS.DETAILS(id)
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error fetching appointment details:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: ID, data?: CancelAppointmentPayload): Promise<{ message: string; appointment: Appointment }> {
    try {
      const response = await this.client.post<{ message: string; appointment: Appointment }>(
        APPOINTMENT_ENDPOINTS.CANCEL(id),
        data || { reason: 'Cancelled by patient' }
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(
    id: ID,
    data: RescheduleAppointmentPayload
  ): Promise<{ message: string; appointment: Appointment }> {
    try {
      const response = await this.client.post<{ message: string; appointment: Appointment }>(
        APPOINTMENT_ENDPOINTS.RESCHEDULE(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error rescheduling appointment:', error);
      throw error;
    }
  }

  /**
   * Confirm appointment
   */
  async confirmAppointment(id: ID): Promise<{ message: string; appointment: Appointment }> {
    try {
      const response = await this.client.post<{ message: string; appointment: Appointment }>(
        APPOINTMENT_ENDPOINTS.CONFIRM(id)
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error confirming appointment:', error);
      throw error;
    }
  }

  /**
   * Get appointment statistics
   */
  async getAppointmentStats(): Promise<AppointmentStatistics> {
    try {
      const response = await this.client.get<AppointmentStatistics>(
        APPOINTMENT_ENDPOINTS.STATS
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error fetching appointment stats:', error);
      throw error;
    }
  }

  /**
   * Check doctor availability for a specific date/time
   */
  async checkAvailability(params: {
    doctorId: ID;
    date: ISODateString;
    time?: string;
    hospitalId?: ID;
  }): Promise<{ available: boolean; slots?: string[] }> {
    try {
      const response = await this.client.get<{ available: boolean; slots?: string[] }>(
        APPOINTMENT_ENDPOINTS.CHECK_AVAILABILITY,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error checking availability:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a doctor
   */
  async getAvailableSlots(params: {
    doctorId: ID;
    date: ISODateString;
    hospitalId?: ID;
    duration?: number;
  }): Promise<{ slots: string[]; breakSlots?: string[] }> {
    try {
      const response = await this.client.get<{ slots: string[]; breakSlots?: string[] }>(
        APPOINTMENT_ENDPOINTS.AVAILABLE_SLOTS,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error fetching available slots:', error);
      throw error;
    }
  }

  /**
   * Get appointment by reference number
   */
  async getAppointmentByReference(referenceNo: string): Promise<Appointment> {
    try {
      const response = await this.client.get<Appointment>(
        `${APPOINTMENT_ENDPOINTS.BASE}/reference/${referenceNo}`
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error fetching appointment by reference:', error);
      throw error;
    }
  }

  /**
   * Download appointment receipt/invoice
   */
  async downloadReceipt(id: ID): Promise<Blob> {
    try {
      const response = await this.client.get<Blob>(
        `${APPOINTMENT_ENDPOINTS.DETAILS(id)}/receipt`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error downloading receipt:', error);
      throw error;
    }
  }

  /**
   * Add appointment to calendar (Google/Apple)
   */
  async addToCalendar(id: ID): Promise<{ calendarUrl: string }> {
    try {
      const response = await this.client.get<{ calendarUrl: string }>(
        `${APPOINTMENT_ENDPOINTS.DETAILS(id)}/calendar`
      );
      return response.data;
    } catch (error) {
      console.error('[AppointmentService] Error adding to calendar:', error);
      throw error;
    }
  }
}

// Singleton instance
export const appointmentService = new AppointmentService();

export { AppointmentService };