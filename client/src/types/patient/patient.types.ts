// client/src/types/patient/patient.types.ts

import type { ID, ISODateString, Timestamps } from '../shared';

// ============================================================================
// ENUMS
// ============================================================================

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

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
  DOMESTIC_PARTNERSHIP = "DOMESTIC_PARTNERSHIP",
}

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

export enum LoyaltyTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  DIAMOND = "DIAMOND",
}

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

export interface PatientDocument {
  id: ID;
  type: "id_card" | "insurance_card" | "medical_report" | "prescription" | "consent_form" | "other";
  name: string;
  url: string;
  uploadedAt: ISODateString;
  verified: boolean;
  notes?: string;
}

export interface PatientConsent {
  type: "terms_of_service" | "privacy_policy" | "hipaa" | "marketing" | "data_sharing";
  version: string;
  acceptedAt: ISODateString;
  acceptedBy: ID;
  ipAddress?: string;
}

// ============================================================================
// MAIN PATIENT ENTITY
// ============================================================================

export interface Patient extends Timestamps {
  readonly id: ID;
  readonly userId: ID;
  readonly tenantId?: ID;

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
  
  readonly address?: Address;
  readonly alternateAddress?: Address;
  readonly emergencyContacts: EmergencyContact[];
  
  readonly medicalHistory?: MedicalHistorySummary;
  readonly metrics?: PatientMetrics;
  readonly documents?: PatientDocument[];
  
  readonly insurance?: InsuranceInfo[];
  
  readonly preferences: PatientPreferences;
  readonly preferredLanguage?: string;
  readonly preferredDoctorIds?: ID[];
  readonly preferredHospitalIds?: ID[];
  
  readonly status: PatientStatus;
  readonly type: PatientType;
  readonly loyaltyTier: LoyaltyTier;
  readonly loyaltyPoints: number;
  readonly isEmailVerified: boolean;
  readonly isPhoneVerified: boolean;
  readonly isIdentityVerified: boolean;
  readonly verificationDocuments?: PatientDocument[];
  
  readonly totalSpent: number;
  readonly outstandingBalance: number;
  readonly creditLimit?: number;
  
  readonly familyMembers?: PatientFamilyMember[];
  readonly primaryCarePhysician?: ID;
  
  readonly consents: PatientConsent[];
  readonly termsAcceptedVersion?: string;
  readonly privacyAcceptedVersion?: string;
  readonly hipaaAcceptedAt?: ISODateString;
  readonly dataDeletionRequested?: boolean;
  readonly dataDeletionRequestedAt?: ISODateString;
  
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
  
  readonly version: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly deletedAt?: ISODateString;
  readonly deletedBy?: ID;
  readonly lastLoginAt?: ISODateString;
  readonly lastIpAddress?: string;
}

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

export interface ProfilePictureUploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
  };
  message?: string;
}

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