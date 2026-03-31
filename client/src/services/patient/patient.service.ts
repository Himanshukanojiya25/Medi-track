// client/src/services/patient/patient.service.ts

import { createApiClient } from '../../lib/api/http.client';
import { apiConfig } from '../../app/config/api.config';
import type { PaginatedResponse } from '../../lib/api/http.client';

// Import your existing types
import type {
  Patient,
  UpdatePatientProfilePayload,
  ProfilePictureUploadResponse,
  PatientStatistics,
  EmergencyContact,
  InsuranceInfo,
  PatientStatus,
} from '../../types/patient/patient.types';

// Import shared types
import type { ISODateString } from '../../types/shared';

// Types for operations
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationPreferencesData {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointmentReminders: boolean;
  promotionalEmails: boolean;
}

export interface PatientActivity {
  id: string;
  type: 'appointment' | 'prescription' | 'report' | 'profile' | 'feedback';
  title: string;
  description: string;
  timestamp: ISODateString;
  metadata?: Record<string, unknown>;
}

// API endpoints
const PATIENT_ENDPOINTS = {
  PROFILE: '/patient/profile',
  UPDATE_PROFILE: '/patient/profile',
  CHANGE_PASSWORD: '/patient/change-password',
  UPLOAD_AVATAR: '/patient/avatar',
  DELETE_ACCOUNT: '/patient/account',
  DEACTIVATE_ACCOUNT: '/patient/deactivate',
  PATIENT_STATS: '/patient/stats',
  PATIENT_ACTIVITY: '/patient/activity',
  EMERGENCY_CONTACT: '/patient/emergency-contact',
  INSURANCE_INFO: '/patient/insurance',
  NOTIFICATION_PREFS: '/patient/notifications/preferences',
};

class PatientService {
  private client = createApiClient(apiConfig.get().baseURL, {
    timeout: apiConfig.get().timeoutMs,
    withCredentials: apiConfig.get().withCredentials,
  });

  /**
   * Get patient profile
   */
  async getProfile(): Promise<Patient> {
    try {
      const response = await this.client.get<Patient>(PATIENT_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Update patient profile
   */
  async updateProfile(data: UpdatePatientProfilePayload): Promise<Patient> {
    try {
      const response = await this.client.patch<Patient>(
        PATIENT_ENDPOINTS.UPDATE_PROFILE,
        data
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Upload profile picture/avatar
   */
  async uploadAvatar(file: File): Promise<ProfilePictureUploadResponse> {
    try {
      const response = await this.client.upload<ProfilePictureUploadResponse>(
        PATIENT_ENDPOINTS.UPLOAD_AVATAR,
        file
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await this.client.post<{ message: string }>(
        PATIENT_ENDPOINTS.CHANGE_PASSWORD,
        data
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error changing password:', error);
      throw error;
    }
  }

  /**
   * Get patient statistics
   */
  async getStats(): Promise<PatientStatistics> {
    try {
      const response = await this.client.get<PatientStatistics>(PATIENT_ENDPOINTS.PATIENT_STATS);
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error fetching stats:', error);
      throw error;
    }
  }

  /**
   * Get patient activity feed
   */
  async getActivity(limit = 10, page = 1): Promise<PaginatedResponse<PatientActivity>> {
    try {
      const response = await this.client.getPaginated<PatientActivity>(
        PATIENT_ENDPOINTS.PATIENT_ACTIVITY,
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error('[PatientService] Error fetching activity:', error);
      throw error;
    }
  }

  /**
   * Update emergency contact
   */
  async updateEmergencyContact(data: EmergencyContact): Promise<Patient> {
    try {
      const response = await this.client.put<Patient>(
        PATIENT_ENDPOINTS.EMERGENCY_CONTACT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error updating emergency contact:', error);
      throw error;
    }
  }

  /**
   * Get emergency contact
   */
  async getEmergencyContact(): Promise<EmergencyContact | null> {
    try {
      const response = await this.client.get<{ emergencyContact: EmergencyContact }>(
        PATIENT_ENDPOINTS.EMERGENCY_CONTACT
      );
      return response.data.emergencyContact;
    } catch (error) {
      console.error('[PatientService] Error fetching emergency contact:', error);
      throw error;
    }
  }

  /**
   * Update insurance information
   */
  async updateInsuranceInfo(data: InsuranceInfo): Promise<Patient> {
    try {
      const response = await this.client.put<Patient>(
        PATIENT_ENDPOINTS.INSURANCE_INFO,
        data
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error updating insurance info:', error);
      throw error;
    }
  }

  /**
   * Get insurance information
   */
  async getInsuranceInfo(): Promise<InsuranceInfo | null> {
    try {
      const response = await this.client.get<{ insurance: InsuranceInfo }>(
        PATIENT_ENDPOINTS.INSURANCE_INFO
      );
      return response.data.insurance;
    } catch (error) {
      console.error('[PatientService] Error fetching insurance info:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(data: NotificationPreferencesData): Promise<NotificationPreferencesData> {
    try {
      const response = await this.client.put<NotificationPreferencesData>(
        PATIENT_ENDPOINTS.NOTIFICATION_PREFS,
        data
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferencesData> {
    try {
      const response = await this.client.get<NotificationPreferencesData>(
        PATIENT_ENDPOINTS.NOTIFICATION_PREFS
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Deactivate account (temporary)
   */
  async deactivateAccount(reason?: string): Promise<{ message: string }> {
    try {
      const response = await this.client.post<{ message: string }>(
        PATIENT_ENDPOINTS.DEACTIVATE_ACCOUNT,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error deactivating account:', error);
      throw error;
    }
  }

  /**
   * Reactivate account
   */
  async reactivateAccount(): Promise<{ message: string }> {
    try {
      const response = await this.client.post<{ message: string }>(
        `${PATIENT_ENDPOINTS.DEACTIVATE_ACCOUNT}/reactivate`
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error reactivating account:', error);
      throw error;
    }
  }

  /**
   * Delete account permanently
   * Using POST with body since DELETE with body might not be supported by all servers
   */
  async deleteAccount(confirmation: string): Promise<{ message: string }> {
    try {
      // Using POST instead of DELETE with body for better compatibility
      const response = await this.client.post<{ message: string }>(
        `${PATIENT_ENDPOINTS.DELETE_ACCOUNT}/permanent`,
        { confirmation }
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error deleting account:', error);
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    try {
      const response = await this.client.get<{ exists: boolean }>(
        `${PATIENT_ENDPOINTS.PROFILE}/check-email`,
        {
          params: { email }
        }
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error checking email:', error);
      throw error;
    }
  }

  /**
   * Request data export (GDPR compliance)
   */
  async requestDataExport(): Promise<{ requestId: string; message: string }> {
    try {
      const response = await this.client.post<{ requestId: string; message: string }>(
        `${PATIENT_ENDPOINTS.PROFILE}/export-data`
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error requesting data export:', error);
      throw error;
    }
  }

  /**
   * Get data export status
   */
  async getDataExportStatus(requestId: string): Promise<{ status: string; downloadUrl?: string }> {
    try {
      const response = await this.client.get<{ status: string; downloadUrl?: string }>(
        `${PATIENT_ENDPOINTS.PROFILE}/export-data/${requestId}`
      );
      return response.data;
    } catch (error) {
      console.error('[PatientService] Error fetching export status:', error);
      throw error;
    }
  }

  /**
   * Get patient status
   */
  async getStatus(): Promise<PatientStatus> {
    try {
      const response = await this.client.get<{ status: PatientStatus }>(
        `${PATIENT_ENDPOINTS.PROFILE}/status`
      );
      return response.data.status;
    } catch (error) {
      console.error('[PatientService] Error fetching status:', error);
      throw error;
    }
  }
}

// Singleton instance
export const patientService = new PatientService();

// Export class for testing/dependency injection
export { PatientService };