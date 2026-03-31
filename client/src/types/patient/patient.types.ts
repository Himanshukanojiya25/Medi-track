// client/src/types/patient/patient.types.ts

import type { ID, ISODateString, Timestamps } from "../shared";
import type { PaginationParams } from "./index";

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Patient account status - Comprehensive status workflow
 */
export enum PatientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  BLOCKED = "BLOCKED",
  DEACTIVATED = "DEACTIVATED",
  DELETED = "DELETED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Blood group enum
 */
export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  UNKNOWN = "UNKNOWN",
}

/**
 * Gender enum
 */
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

/**
 * Marital status enum
 */
export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
  DOMESTIC_PARTNERSHIP = "DOMESTIC_PARTNERSHIP",
}

/**
 * Patient type classification
 */
export enum PatientType {
  REGULAR = "REGULAR",
  VIP = "VIP",
  CORPORATE = "CORPORATE",
  INSURANCE = "INSURANCE",
  GOVERNMENT = "GOVERNMENT",
  EMERGENCY = "EMERGENCY",
  REFERRAL = "REFERRAL",
  WALK_IN = "WALK_IN",
  TELEMEDICINE = "TELEMEDICINE",
}

/**
 * Patient loyalty tier
 */
export enum LoyaltyTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  DIAMOND = "DIAMOND",
}

/**
 * Communication preference
 */
export enum CommunicationPreference {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
  WHATSAPP = "WHATSAPP",
  PHONE = "PHONE",
  MAIL = "MAIL",
  NONE = "NONE",
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Address interface - Enhanced
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  apartment?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isPrimary?: boolean;
  type?: "home" | "work" | "other";
}

/**
 * Emergency contact - Enhanced
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  priority?: number;
  consentToContact?: boolean;
}

/**
 * Insurance information - Enhanced
 */
export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validFrom: ISODateString;
  validUntil: ISODateString;
  coverageAmount?: number;
  deductible?: number;
  copay?: number;
  coinsurance?: number;
  cardUrl?: string;
  primaryHolder?: string;
  primaryHolderId?: string;
  relationshipToHolder?: string;
  insuranceType?: "private" | "government" | "employer" | "family";
  isPrimary: boolean;
  authorizationRequired?: boolean;
  authorizationCode?: string;
  status?: "active" | "expired" | "pending" | "cancelled";
}

/**
 * Medical history summary
 */
export interface MedicalHistorySummary {
  chronicConditions?: string[];
  allergies?: string[];
  medications?: string[];
  surgeries?: string[];
  familyHistory?: string[];
  lifestyle?: {
    smoking?: "never" | "former" | "current";
    alcohol?: "never" | "occasional" | "regular";
    exercise?: "none" | "light" | "moderate" | "frequent";
    diet?: string;
  };
  lastUpdated?: ISODateString;
}

/**
 * Patient preferences
 */
export interface PatientPreferences {
  language?: string;
  timezone?: string;
  dateFormat?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointmentReminders: boolean;
    promotionalEmails: boolean;
    newsletter: boolean;
    healthTips: boolean;
  };
  communication: CommunicationPreference[];
  privacy: {
    shareWithDoctors: boolean;
    shareWithHospitals: boolean;
    shareForResearch: boolean;
    dataRetentionDays?: number;
  };
  accessibility?: {
    largeText?: boolean;
    highContrast?: boolean;
    screenReader?: boolean;
  };
}

/**
 * Patient metrics and health data
 */
export interface PatientMetrics {
  height?: number;
  weight?: number;
  bmi?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    recordedAt: ISODateString;
  };
  heartRate?: number;
  temperature?: number;
  glucose?: number;
  cholesterol?: {
    total: number;
    hdl: number;
    ldl: number;
    triglycerides: number;
  };
  lastVitalsUpdate?: ISODateString;
  healthScore?: number;
  riskFactors?: string[];
}

/**
 * Patient documents
 */
export interface PatientDocument {
  id: ID;
  type: "id_card" | "insurance_card" | "medical_report" | "prescription" | "consent_form" | "other";
  name: string;
  url: string;
  uploadedAt: ISODateString;
  verified: boolean;
  notes?: string;
}

/**
 * Audit log entry for patient
 */
export interface PatientAuditLog {
  action: string;
  performedBy: ID;
  performedByRole: string;
  timestamp: ISODateString;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
}

/**
 * Patient consent records
 */
export interface PatientConsent {
  type: "terms_of_service" | "privacy_policy" | "hipaa" | "marketing" | "data_sharing";
  version: string;
  acceptedAt: ISODateString;
  acceptedBy: ID;
  ipAddress?: string;
}

/**
 * Patient referral information
 */
export interface PatientReferral {
  referredBy?: ID;
  referralCode?: string;
  referralSource?: string;
  referralDate?: ISODateString;
  referredTo?: ID;
}

// ============================================================================
// MAIN PATIENT ENTITY - ENTERPRISE VERSION
// ============================================================================

/**
 * Core Patient entity - Enhanced Enterprise Version
 * Linked to a User record
 */
export interface Patient extends Timestamps {
  readonly id: ID;
  readonly userId: ID;
  readonly tenantId?: ID;

  // Basic Information
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly gender?: Gender;
  readonly dateOfBirth?: ISODateString;
  readonly age?: number;
  readonly bloodGroup?: BloodGroup;
  readonly maritalStatus?: MaritalStatus;
  readonly profilePicture?: string;
  readonly occupation?: string;
  readonly nationality?: string;
  readonly religion?: string;
  
  // Contact Information
  readonly address?: Address;
  readonly alternateAddress?: Address;
  readonly emergencyContacts: EmergencyContact[];
  
  // Medical Information
  readonly medicalHistory?: MedicalHistorySummary;
  readonly metrics?: PatientMetrics;
  readonly documents?: PatientDocument[];
  
  // Insurance
  readonly insurance?: InsuranceInfo[];
  
  // Preferences & Settings
  readonly preferences: PatientPreferences;
  readonly preferredLanguage?: string;
  readonly preferredDoctorIds?: ID[];
  readonly preferredHospitalIds?: ID[];
  
  // Status & Verification
  readonly status: PatientStatus;
  readonly type: PatientType;
  readonly loyaltyTier: LoyaltyTier;
  readonly loyaltyPoints: number;
  readonly isEmailVerified: boolean;
  readonly isPhoneVerified: boolean;
  readonly isIdentityVerified: boolean;
  readonly verificationDocuments?: PatientDocument[];
  
  // Financial
  readonly totalSpent: number;
  readonly outstandingBalance: number;
  readonly creditLimit?: number;
  readonly paymentMethods?: {
    id: string;
    type: string;
    last4: string;
    isDefault: boolean;
  }[];
  
  // Relationships
  readonly familyMembers?: PatientFamilyMember[];
  readonly primaryCarePhysician?: ID;
  
  // Consent & Legal
  readonly consents: PatientConsent[];
  readonly termsAcceptedVersion?: string;
  readonly privacyAcceptedVersion?: string;
  readonly hipaaAcceptedAt?: ISODateString;
  readonly dataDeletionRequested?: boolean;
  readonly dataDeletionRequestedAt?: ISODateString;
  
  // Analytics
  readonly lastVisit?: ISODateString;
  readonly totalAppointments: number;
  readonly upcomingAppointments: number;
  readonly completedAppointments: number;
  readonly cancelledAppointments: number;
  readonly noShowCount: number;
  readonly totalPrescriptions: number;
  readonly totalReports: number;
  readonly favoriteDoctors: number;
  readonly favoriteHospitals: number;
  
  // Referral
  readonly referral?: PatientReferral;
  readonly referredPatients?: ID[];
  
  // Audit
  readonly auditLog?: PatientAuditLog[];
  
  // Metadata
  readonly metadata?: Record<string, any>;
  readonly tags?: string[];
  readonly notes?: string;
  
  // System Fields
  readonly version: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly deletedAt?: ISODateString;
  readonly deletedBy?: ID;
  readonly lastLoginAt?: ISODateString;
  readonly lastIpAddress?: string;
}

/**
 * Patient family member
 */
export interface PatientFamilyMember {
  id: ID;
  name: string;
  relationship: string;
  dateOfBirth?: ISODateString;
  gender?: Gender;
  isDependent?: boolean;
  consentToShare?: boolean;
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

/**
 * Patient profile update payload - Enhanced
 */
export interface UpdatePatientProfilePayload {
  name?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: ISODateString;
  bloodGroup?: BloodGroup;
  maritalStatus?: MaritalStatus;
  address?: Address;
  alternateAddress?: Address;
  emergencyContacts?: EmergencyContact[];
  insurance?: InsuranceInfo[];
  occupation?: string;
  preferredLanguage?: string;
  preferences?: Partial<PatientPreferences>;
  metrics?: Partial<PatientMetrics>;
}

/**
 * Patient profile picture upload response
 */
export interface ProfilePictureUploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
  };
  message?: string;
}

/**
 * Patient statistics - Enhanced
 */
export interface PatientStatistics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  totalPrescriptions: number;
  totalReports: number;
  favoriteDoctors: number;
  favoriteHospitals: number;
  lastActive: ISODateString;
  totalSpent: number;
  outstandingBalance: number;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  noShowRate: number;
  averageRating: number;
  healthScore: number;
  thisYearVisits: number;
  lastYearVisits: number;
}

// ============================================================================
// STORE & API TYPES
// ============================================================================

/**
 * Patient state for Redux store
 */
export interface PatientState {
  profile: Patient | null;
  statistics: PatientStatistics | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  isFetchingStats: boolean;
  updateSuccess: boolean;
  documents: PatientDocument[];
  consents: PatientConsent[];
}

/**
 * Patient API response types
 */
export interface PatientApiResponse {
  success: boolean;
  data: Patient;
  message?: string;
  timestamp?: ISODateString;
}

export interface PatientListApiResponse {
  success: boolean;
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Patient filters for listing - Enhanced
 */
export interface PatientFilters extends PaginationParams {
  status?: PatientStatus | PatientStatus[];
  type?: PatientType | PatientType[];
  loyaltyTier?: LoyaltyTier | LoyaltyTier[];
  search?: string;
  fromDate?: ISODateString;
  toDate?: ISODateString;
  gender?: Gender | Gender[];
  bloodGroup?: BloodGroup | BloodGroup[];
  ageRange?: {
    min: number;
    max: number;
  };
  lastVisitFrom?: ISODateString;
  lastVisitTo?: ISODateString;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  hasInsurance?: boolean;
  hospitalId?: ID;
  doctorId?: ID;
  sortBy?: keyof Patient;
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// WEBHOOK & EVENT TYPES
// ============================================================================

/**
 * Patient webhook events
 */
export type PatientWebhookEvent = 
  | "patient.created"
  | "patient.updated"
  | "patient.deactivated"
  | "patient.activated"
  | "patient.merged"
  | "patient.consent.updated"
  | "patient.document.uploaded"
  | "patient.insurance.added"
  | "patient.insurance.expired"
  | "patient.loyalty.tier.changed";

/**
 * Patient webhook payload
 */
export interface PatientWebhookPayload {
  event: PatientWebhookEvent;
  patientId: ID;
  patient: Patient;
  timestamp: ISODateString;
  triggeredBy: ID;
  changes?: Partial<Patient>;
}