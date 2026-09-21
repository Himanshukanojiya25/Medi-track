// client/src/features/patient/services/index.ts

// ── Services ─────────────────────────────────────────────────────────────────
export { default as appointmentService }   from './appointment.service';
export { default as doctorService }        from './doctor.service';
export { default as favoriteService }      from './favorite.service';
export { default as feedbackService }      from './feedback.service';
export { default as hospitalService }      from './hospital.service';
export { default as medicalHistoryService } from './medical-history.service';
export { default as notificationService }  from './notification.service';
export { default as patientService }       from './patient.service';
export { default as prescriptionService }  from './prescription.service';
export { default as uploadService }        from './upload.service';

// ── Types re-exports (appointment) ──────────────────────────────────────────
export type {
  Appointment,
  BookAppointmentPayload,
  RescheduleAppointmentPayload,
  CancelAppointmentPayload,
  AppointmentListParams,
  AppointmentListResponse,
  AppointmentListType,
} from './appointment.service';
export { AppointmentStatus, AppointmentType } from './appointment.service';

// ── Types re-exports (prescription) ─────────────────────────────────────────
export type {
  Prescription,
  PrescriptionMedication,
  PrescriptionListParams,
  PrescriptionListResponse,
} from './prescription.service';
export {
  PrescriptionStatus,
  MedicationFrequency,
  MedicationRoute,
} from './prescription.service';

// ── Types re-exports (notification) ─────────────────────────────────────────
export type {
  Notification,
  NotificationListParams,
  NotificationListResponse,
} from './notification.service';
export {
  NotificationCategory,
  NotificationPriority,
} from './notification.service';

// ── Types re-exports (feedback) ──────────────────────────────────────────────
export type {
  Feedback,
  SubmitFeedbackPayload,
  UpdateFeedbackPayload,
  FeedbackListParams,
  FeedbackRating,
} from './feedback.service';
export { FeedbackEntityType, FeedbackStatus } from './feedback.service';

// ── Types re-exports (upload) ────────────────────────────────────────────────
export type { UploadProgressCallback } from './upload.service';

// ── Types re-exports (favorite) ──────────────────────────────────────────────
export type { FavouriteItem } from './favorite.service';