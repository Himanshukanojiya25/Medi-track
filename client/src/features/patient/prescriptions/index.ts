// client/src/features/patient/prescriptions/index.ts

// ── Screen ────────────────────────────────────────────────────────────────────
export { default as PrescriptionsScreen } from './PrescriptionsScreen';

// ── Components ────────────────────────────────────────────────────────────────
export { default as PrescriptionCard }             from './PrescriptionCard';
export { default as PrescriptionList }             from './PrescriptionList';
export { default as PrescriptionFilter }           from './PrescriptionFilter';
export { default as PrescriptionDetail }           from './PrescriptionDetail';
export { default as DownloadPrescriptionButton }   from './DownloadPrescriptionButton';

// ── Service + Types ───────────────────────────────────────────────────────────
export {
  prescriptionService,
  getMockPrescription,
  getMockPrescriptions,
  MOCK_PRESCRIPTIONS,
  PrescriptionStatus,
  MedicationFrequency,
  MedicationTiming,
  MedicationRoute,
  FREQUENCY_LABELS,
  TIMING_LABELS,
  ROUTE_LABELS,
} from '../services/prescription.service';

export type {
  Prescription,
  Medication,
  PrescriptionFilters,
  PrescriptionListResponse,
} from '../services/prescription.service';