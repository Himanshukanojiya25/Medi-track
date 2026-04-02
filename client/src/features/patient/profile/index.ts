// src/features/patient/profile/index.ts

// Export all profile components (named exports only, no default re-exports)
export { ProfileScreen } from './ProfileScreen';
export { PersonalInfoForm } from './PersonalInfoForm';
export { ProfilePictureUpload } from './ProfilePictureUpload';
export { ChangePasswordForm } from './ChangePasswordForm';
export { EmergencyContactForm } from './EmergencyContactForm';
export { InsuranceInfoForm } from './InsuranceInfoForm';
export { NotificationPreferences } from './NotificationPreferences';
export { PrivacySettings } from './PrivacySettings';
export { DeleteAccountModal } from './DeleteAccountModal';

// Re-export types from types file using 'export type'
export type {
  Patient,
  EmergencyContact,
  InsuranceInfo,
  PatientPreferences,
  UpdatePatientProfilePayload,
  ProfilePictureUploadResponse,
  PatientStatistics,
} from '../../../types/patient/patient.types';