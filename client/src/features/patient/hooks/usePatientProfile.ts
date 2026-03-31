// client/src/features/patient/hooks/usePatientProfile.ts

import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../../../services/patient';
import type { 
  Patient, 
  UpdatePatientProfilePayload,
  ProfilePictureUploadResponse,
  PatientStatus,
  PatientType,
  LoyaltyTier,
  PatientPreferences,
  EmergencyContact,
  InsuranceInfo,
  Address,
} from '../../../types/patient/patient.types';
import { CommunicationPreference } from '../../../types/patient/patient.types';

// ============================================================================
// TYPES
// ============================================================================

export interface UsePatientProfileOptions {
  autoFetch?: boolean;
  includeStats?: boolean;
}

export interface UsePatientProfileReturn {
  profile: Patient | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateSuccess: boolean;
  refetch: () => Promise<void>;
  updateProfile: (data: UpdatePatientProfilePayload) => Promise<Patient>;
  uploadAvatar: (file: File) => Promise<ProfilePictureUploadResponse>;
  updateEmergencyContact: (contact: EmergencyContact) => Promise<Patient>;
  updateInsurance: (insurance: InsuranceInfo) => Promise<Patient>;
  updatePreferences: (preferences: Partial<PatientPreferences>) => Promise<Patient>;
  clearError: () => void;
  clearUpdateSuccess: () => void;
}

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockPatient: Patient = {
  id: 'patient_001',
  userId: 'user_001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  status: 'ACTIVE' as PatientStatus,
  type: 'REGULAR' as PatientType,
  loyaltyTier: 'SILVER' as LoyaltyTier,
  loyaltyPoints: 1250,
  isEmailVerified: true,
  isPhoneVerified: true,
  isIdentityVerified: true,
  totalSpent: 1250,
  outstandingBalance: 0,
  emergencyContacts: [],
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      sms: true,
      push: true,
      appointmentReminders: true,
      promotionalEmails: false,
      newsletter: false,
      healthTips: true,
    },
    communication: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    privacy: {
      shareWithDoctors: true,
      shareWithHospitals: true,
      shareForResearch: false,
    },
  },
  consents: [],
  totalAppointments: 24,
  upcomingAppointments: 3,
  completedAppointments: 18,
  cancelledAppointments: 3,
  noShowCount: 0,
  totalPrescriptions: 12,
  totalReports: 8,
  favoriteDoctors: 4,
  favoriteHospitals: 2,
  version: 1,
  isActive: true,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================================
// MOCK SERVICE (Replace with actual API call)
// ============================================================================

const patientApiService = {
  getProfile: async (): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPatient;
  },
  
 updateProfile: async (data: UpdatePatientProfilePayload): Promise<Patient> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Properly merge nested objects to avoid undefined issues
  const updatedPatient: Patient = {
    ...mockPatient,
    ...data,
    // Ensure preferences is properly merged if provided
    preferences: data.preferences 
      ? {
          ...mockPatient.preferences,
          ...data.preferences,
          notifications: {
            ...mockPatient.preferences.notifications,
            ...data.preferences.notifications,
          },
          privacy: {
            ...mockPatient.preferences.privacy,
            ...data.preferences.privacy,
          },
        }
      : mockPatient.preferences,
    // Ensure address is properly merged if provided
    address: data.address 
      ? {
          ...mockPatient.address,
          ...data.address,
        }
      : mockPatient.address,
    // Ensure alternateAddress is properly merged if provided
    alternateAddress: data.alternateAddress 
      ? {
          ...mockPatient.alternateAddress,
          ...data.alternateAddress,
        }
      : mockPatient.alternateAddress,
    // Ensure emergencyContacts is properly handled
    emergencyContacts: data.emergencyContacts 
      ? data.emergencyContacts 
      : mockPatient.emergencyContacts,
    // Ensure insurance is properly handled
    insurance: data.insurance 
      ? data.insurance 
      : mockPatient.insurance,
    // Ensure metrics is properly merged if provided
    metrics: data.metrics 
      ? {
          ...mockPatient.metrics,
          ...data.metrics,
        }
      : mockPatient.metrics,
    updatedAt: new Date().toISOString(),
  };
  
  return updatedPatient;
},
  
  uploadAvatar: async (file: File): Promise<ProfilePictureUploadResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        url: URL.createObjectURL(file),
        publicId: `avatar_${Date.now()}`,
      },
      message: 'Avatar uploaded successfully',
    };
  },
  
  updateEmergencyContact: async (contact: EmergencyContact): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockPatient,
      emergencyContacts: [contact],
      updatedAt: new Date().toISOString(),
    };
  },
  
  updateInsurance: async (insurance: InsuranceInfo): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockPatient,
      insurance: [insurance],
      updatedAt: new Date().toISOString(),
    };
  },
  
  updatePreferences: async (preferences: Partial<PatientPreferences>): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockPatient,
      preferences: {
        ...mockPatient.preferences,
        ...preferences,
        notifications: {
          ...mockPatient.preferences.notifications,
          ...(preferences.notifications || {}),
        },
      },
      updatedAt: new Date().toISOString(),
    };
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const usePatientProfile = (options: UsePatientProfileOptions = {}): UsePatientProfileReturn => {
  const { autoFetch = true } = options;
  
  const [profile, setProfile] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  const clearError = useCallback(() => setError(null), []);
  const clearUpdateSuccess = useCallback(() => setUpdateSuccess(false), []);

  const fetchProfile = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await patientApiService.getProfile();
      setProfile(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      console.error('[usePatientProfile] Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdatePatientProfilePayload): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientApiService.updateProfile(data);
      setProfile(updated);
      setUpdateSuccess(true);
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      console.error('[usePatientProfile] Error updating profile:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<ProfilePictureUploadResponse> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await patientApiService.uploadAvatar(file);
      if (response.success && response.data?.url) {
        setProfile(prev => prev ? { ...prev, profilePicture: response.data.url } : null);
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload avatar';
      setError(errorMessage);
      console.error('[usePatientProfile] Error uploading avatar:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const updateEmergencyContact = useCallback(async (contact: EmergencyContact): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientApiService.updateEmergencyContact(contact);
      setProfile(updated);
      setUpdateSuccess(true);
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update emergency contact';
      setError(errorMessage);
      console.error('[usePatientProfile] Error updating emergency contact:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const updateInsurance = useCallback(async (insurance: InsuranceInfo): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientApiService.updateInsurance(insurance);
      setProfile(updated);
      setUpdateSuccess(true);
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update insurance';
      setError(errorMessage);
      console.error('[usePatientProfile] Error updating insurance:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const updatePreferences = useCallback(async (preferences: Partial<PatientPreferences>): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientApiService.updatePreferences(preferences);
      setProfile(updated);
      setUpdateSuccess(true);
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update preferences';
      setError(errorMessage);
      console.error('[usePatientProfile] Error updating preferences:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [autoFetch, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    isUpdating,
    updateSuccess,
    refetch: fetchProfile,
    updateProfile,
    uploadAvatar,
    updateEmergencyContact,
    updateInsurance,
    updatePreferences,
    clearError,
    clearUpdateSuccess,
  };
};

export default usePatientProfile;