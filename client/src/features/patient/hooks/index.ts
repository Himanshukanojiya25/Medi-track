// client/src/features/patient/hooks/index.ts

export { usePatientProfile } from './usePatientProfile';
export { useAppointments } from './useAppointments';
export { useBookAppointment } from './useBookAppointment';
export { useCancelAppointment } from './useCancelAppointment';
export { useFavorites } from './useFavorites';
export { useMedicalHistory } from './useMedicalHistory';
export { useNotifications } from './useNotifications';
export { usePrescriptions } from './usePrescriptions';
export { useRescheduleAppointment } from './useRescheduleAppointment';
export { useUploadReport } from './useUploadReport';

// Re-export types - using 'typeof' imports to avoid module resolution issues
export type { UsePatientProfileReturn, UsePatientProfileOptions } from './usePatientProfile';
export type { UseAppointmentsReturn, UseAppointmentsOptions } from './useAppointments';
export type { BookAppointmentPayload } from './useBookAppointment';
export type { CancelAppointmentPayload } from './useCancelAppointment';
export type { FavoriteDoctor, FavoriteHospital, FavoriteFilters } from './useFavorites';
export type { MedicalCondition, Allergy, Medication, Surgery, MedicalHistoryFilters } from './useMedicalHistory';
export type { Notification, NotificationFilters } from './useNotifications';
export type { Prescription, PrescriptionFilters } from './usePrescriptions';
export type { RescheduleAppointmentPayload } from './useRescheduleAppointment';
export type { UploadedDocument, UploadProgress, UploadOptions } from './useUploadReport';