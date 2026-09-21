// client/src/features/patient/hooks/usePatientProfile.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { patientService } from '../services/patient.service';
import type { 
  Patient, 
  UpdatePatientProfilePayload,
  ProfilePictureUploadResponse,
  PatientPreferences,
  EmergencyContact,
  InsuranceInfo,
} from '../../../types/patient/patient.types';

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
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  clearError: () => void;
  clearUpdateSuccess: () => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const usePatientProfile = (options: UsePatientProfileOptions = {}): UsePatientProfileReturn => {
const { autoFetch = false, includeStats = false } = options;
  
  const [profile, setProfile] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  
  // Ref to prevent duplicate requests
  const fetchCalledRef = useRef<boolean>(false);

  const clearError = useCallback(() => setError(null), []);
  const clearUpdateSuccess = useCallback(() => setUpdateSuccess(false), []);

  // Fetch profile from backend
  const fetchProfile = useCallback(async (): Promise<void> => {
    // Prevent duplicate requests
    if (fetchCalledRef.current && autoFetch) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await patientService.getProfile();
      setProfile(data);
      fetchCalledRef.current = true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      console.error('[usePatientProfile] Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [autoFetch]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdatePatientProfilePayload): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientService.updateProfile(data);
      setProfile(updated);
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
      
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

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<ProfilePictureUploadResponse> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await patientService.uploadAvatar(file);
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

  // Update emergency contact
  const updateEmergencyContact = useCallback(async (contact: EmergencyContact): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientService.updateEmergencyContact(contact);
      setProfile(updated);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
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

  // Update insurance
  const updateInsurance = useCallback(async (insurance: InsuranceInfo): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientService.updateInsurance(insurance);
      setProfile(updated);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
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

  // Update preferences
  const updatePreferences = useCallback(async (preferences: Partial<PatientPreferences>): Promise<Patient> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const updated = await patientService.updatePreferences(preferences);
      setProfile(updated);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
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

  // Change password
  const changePassword = useCallback(async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      await patientService.changePassword(data);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      console.error('[usePatientProfile] Error changing password:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
    
    // Cleanup
    return () => {
      fetchCalledRef.current = false;
    };
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
    changePassword,
    clearError,
    clearUpdateSuccess,
  };
};

export default usePatientProfile;