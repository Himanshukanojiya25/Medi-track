import type { ID, ISODateString, Timestamps } from "../shared";

/**
 * Medical condition severity
 */
export enum Severity {
  MILD = "MILD",
  MODERATE = "MODERATE",
  SEVERE = "SEVERE",
  CRITICAL = "CRITICAL",
}

/**
 * Condition status
 */
export enum ConditionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  RESOLVED = "RESOLVED",
  CHRONIC = "CHRONIC",
  IN_REMISSION = "IN_REMISSION",
}

/**
 * Medical condition interface
 */
export interface MedicalCondition extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly name: string;
  readonly code?: string; // ICD-10 code
  readonly diagnosedDate: ISODateString;
  readonly status: ConditionStatus;
  readonly severity: Severity;
  readonly notes?: string;
  readonly treatment?: string;
  readonly prescribedBy?: string;
  readonly hospital?: string;
  readonly attachments?: string[];
}

/**
 * Allergy interface
 */
export interface Allergy extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly allergen: string;
  readonly reaction: string;
  readonly severity: Severity;
  readonly diagnosedDate: ISODateString;
  readonly isLifeThreatening: boolean;
  readonly notes?: string;
  readonly medicationId?: string;
  readonly treatment?: string;
}

/**
 * Medication interface
 */
export interface Medication extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly name: string;
  readonly dosage: string;
  readonly frequency: string;
  readonly duration?: string;
  readonly startDate: ISODateString;
  readonly endDate?: ISODateString;
  readonly prescribedBy: string;
  readonly prescriptionId?: string;
  readonly isActive: boolean;
  readonly refillRemaining?: number;
  readonly refillDate?: ISODateString;
  readonly notes?: string;
  readonly sideEffects?: string[];
}

/**
 * Surgery interface
 */
export interface Surgery extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly procedure: string;
  readonly date: ISODateString;
  readonly hospital: string;
  readonly surgeon: string;
  readonly anesthesia?: string;
  readonly complications?: string;
  readonly notes?: string;
  readonly dischargeDate?: ISODateString;
}

/**
 * Immunization interface
 */
export interface Immunization extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly vaccine: string;
  readonly doseNumber: number;
  readonly date: ISODateString;
  readonly nextDueDate?: ISODateString;
  readonly administeredBy: string;
  readonly hospital?: string;
  readonly batchNumber?: string;
  readonly expiryDate?: ISODateString;
  readonly manufacturer?: string;
}

/**
 * Vital signs interface
 */
export interface VitalSigns extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly bloodPressureSystolic?: number;
  readonly bloodPressureDiastolic?: number;
  readonly heartRate?: number;
  readonly temperature?: number;
  readonly respiratoryRate?: number;
  readonly oxygenSaturation?: number;
  readonly weight?: number;
  readonly height?: number;
  readonly bmi?: number;
  readonly bloodSugar?: number;
  readonly cholesterol?: number;
  readonly recordedAt: ISODateString;
  readonly recordedBy: string;
  readonly notes?: string;
}

/**
 * Complete medical history
 */
export interface MedicalHistory extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly conditions: MedicalCondition[];
  readonly allergies: Allergy[];
  readonly medications: Medication[];
  readonly surgeries: Surgery[];
  readonly immunizations: Immunization[];
  readonly vitalSigns: VitalSigns[];
  readonly familyHistory?: string;
  readonly socialHistory?: {
    smoking?: {
      status: 'NEVER' | 'FORMER' | 'CURRENT';
      packYears?: number;
      quitDate?: ISODateString;
    };
    alcohol?: {
      status: 'NEVER' | 'OCCASIONAL' | 'REGULAR' | 'HEAVY';
      weeklyUnits?: number;
    };
    exercise?: {
      frequency: 'DAILY' | 'WEEKLY' | 'RARELY' | 'NEVER';
      type?: string;
    };
    diet?: {
      type: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'OTHER';
      notes?: string;
    };
  };
  readonly notes?: string;
}

/**
 * Payload types for adding records
 */
export interface AddConditionPayload {
  name: string;
  code?: string;
  diagnosedDate: ISODateString;
  status: ConditionStatus;
  severity: Severity;
  notes?: string;
  treatment?: string;
  prescribedBy?: string;
  hospital?: string;
  attachments?: string[];
}

export interface AddAllergyPayload {
  allergen: string;
  reaction: string;
  severity: Severity;
  diagnosedDate: ISODateString;
  isLifeThreatening: boolean;
  notes?: string;
  treatment?: string;
}

export interface AddMedicationPayload {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  startDate: ISODateString;
  endDate?: ISODateString;
  prescribedBy: string;
  prescriptionId?: string;
  notes?: string;
  sideEffects?: string[];
}

export interface AddSurgeryPayload {
  procedure: string;
  date: ISODateString;
  hospital: string;
  surgeon: string;
  anesthesia?: string;
  notes?: string;
  dischargeDate?: ISODateString;
}

export interface AddImmunizationPayload {
  vaccine: string;
  doseNumber: number;
  date: ISODateString;
  nextDueDate?: ISODateString;
  administeredBy: string;
  batchNumber?: string;
  manufacturer?: string;
}

export interface AddVitalSignsPayload {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bloodSugar?: number;
  cholesterol?: number;
  recordedAt: ISODateString;
  notes?: string;
}

/**
 * Update payload types
 */
export type UpdateConditionPayload = Partial<Omit<AddConditionPayload, 'patientId'>>;
export type UpdateAllergyPayload = Partial<Omit<AddAllergyPayload, 'patientId'>>;
export type UpdateMedicationPayload = Partial<Omit<AddMedicationPayload, 'patientId'>>;
export type UpdateSurgeryPayload = Partial<Omit<AddSurgeryPayload, 'patientId'>>;
export type UpdateImmunizationPayload = Partial<Omit<AddImmunizationPayload, 'patientId'>>;

/**
 * Medical history state for Redux store
 */
export interface MedicalHistoryState {
  data: MedicalHistory | null;
  conditions: MedicalCondition[];
  allergies: Allergy[];
  medications: Medication[];
  surgeries: Surgery[];
  immunizations: Immunization[];
  vitalSigns: VitalSigns[];
  isLoading: boolean;
  error: string | null;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  selectedRecord: MedicalCondition | Allergy | Medication | Surgery | Immunization | VitalSigns | null;
}

/**
 * API response types
 */
export interface MedicalHistoryApiResponse {
  success: boolean;
  data: MedicalHistory;
  message?: string;
}

export interface ConditionApiResponse {
  success: boolean;
  data: MedicalCondition;
  message?: string;
}

export interface AllergyApiResponse {
  success: boolean;
  data: Allergy;
  message?: string;
}

export interface MedicationApiResponse {
  success: boolean;
  data: Medication;
  message?: string;
}

export interface VitalSignsApiResponse {
  success: boolean;
  data: VitalSigns;
  message?: string;
}