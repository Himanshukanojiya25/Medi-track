// client/src/features/patient/services/patient.service.ts
import { httpClient } from '../../../services/api/http.client';
import type { 
  Patient, 
  UpdatePatientProfilePayload,
  ProfilePictureUploadResponse,
  EmergencyContact,
  InsuranceInfo,
  PatientPreferences,
} from '../../../types/patient/patient.types';

const API_BASE = '/api/patients';

export const patientService = {
  // Get current patient profile
  getProfile: async (): Promise<Patient> => {
    const response = await httpClient.get(`${API_BASE}/me`);
    return response.data;
  },

  // Update patient profile
  updateProfile: async (data: UpdatePatientProfilePayload): Promise<Patient> => {
    const response = await httpClient.put(`${API_BASE}/me`, data);
    return response.data;
  },

  // Upload profile picture
  uploadAvatar: async (file: File): Promise<ProfilePictureUploadResponse> => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await httpClient.post(`${API_BASE}/me/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update emergency contact
  updateEmergencyContact: async (contact: EmergencyContact): Promise<Patient> => {
    const response = await httpClient.put(`${API_BASE}/me/emergency-contact`, contact);
    return response.data;
  },

  // Update insurance
  updateInsurance: async (insurance: InsuranceInfo): Promise<Patient> => {
    const response = await httpClient.put(`${API_BASE}/me/insurance`, insurance);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences: Partial<PatientPreferences>): Promise<Patient> => {
    const response = await httpClient.put(`${API_BASE}/me/preferences`, preferences);
    return response.data;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> => {
    const response = await httpClient.post(`${API_BASE}/me/change-password`, data);
    return response.data;
  },
};

export default patientService;