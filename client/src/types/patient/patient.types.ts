// client/src/types/patient/patient.types.ts

import type { ID, ISODateString, Timestamps } from '../shared';

// ============================================================================
// ENUMS (Enhanced)
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
// NEW ENUMS (Added)
// ============================================================================

export enum RelationshipType {
  SELF = "SELF",
  SPOUSE = "SPOUSE",
  PARENT = "PARENT",
  CHILD = "CHILD",
  SIBLING = "SIBLING",
  GUARDIAN = "GUARDIAN",
  FRIEND = "FRIEND",
  RELATIVE = "RELATIVE",
  OTHER = "OTHER",
}

export enum InsuranceType {
  PRIVATE = "private",
  GOVERNMENT = "government",
  EMPLOYER = "employer",
  FAMILY = "family",
}

export enum InsuranceStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

export enum AddressType {
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}

export enum DocumentType {
  ID_CARD = "id_card",
  INSURANCE_CARD = "insurance_card",
  MEDICAL_REPORT = "medical_report",
  PRESCRIPTION = "prescription",
  CONSENT_FORM = "consent_form",
  OTHER = "other",
}

export enum ConsentType {
  TERMS_OF_SERVICE = "terms_of_service",
  PRIVACY_POLICY = "privacy_policy",
  HIPAA = "hipaa",
  MARKETING = "marketing",
  DATA_SHARING = "data_sharing",
}

// ============================================================================
// INTERFACES (Enhanced)
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  apartment?: string;
  coordinates?: Coordinates;
  isPrimary?: boolean;
  type?: AddressType;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  relationshipType?: RelationshipType;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  priority?: number;
  consentToContact?: boolean;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface InsuranceInfo {
  id?: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validFrom?: ISODateString;
  validUntil?: ISODateString;
  coverageAmount?: number;
  deductible?: number;
  copay?: number;
  coinsurance?: number;
  cardUrl?: string;
  primaryHolder?: string;
  primaryHolderId?: string;
  relationshipToHolder?: string;
  insuranceType?: InsuranceType;
  isPrimary: boolean;
  authorizationRequired?: boolean;
  authorizationCode?: string;
  status?: InsuranceStatus;
  notes?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
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
    sleepHours?: number;
    stressLevel?: "low" | "medium" | "high";
  };
  immunizations?: Array<{
    name: string;
    date: ISODateString;
    nextDueDate?: ISODateString;
  }>;
  lastUpdated?: ISODateString;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  whatsapp?: boolean;
  appointmentReminders: boolean;
  promotionalEmails: boolean;
  newsletter: boolean;
  healthTips: boolean;
  paymentAlerts: boolean;
  prescriptionUpdates: boolean;
  medicalReportAlerts: boolean;
  reminderTiming?: 'immediate' | '1hour' | '1day' | '2days';
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface PrivacySettings {
  shareWithDoctors: boolean;
  shareWithHospitals: boolean;
  shareForResearch: boolean;
  shareWithInsurance?: boolean;
  shareWithPharmacy?: boolean;
  allowDataExport?: boolean;
  allowThirdParty?: boolean;
  anonymizedAnalytics?: boolean;
  showProfileToOthers?: boolean;
  showMedicalHistory?: boolean;
  showPrescriptions?: boolean;
  showAppointments?: boolean;
  twoFactorAuth?: boolean;
  loginAlerts?: boolean;
  deviceManagement?: boolean;
  dataRetentionDays?: number;
}

export interface PatientPreferences {
  language?: string;
  timezone?: string;
  dateFormat?: string;
  currency?: string;
  notifications: NotificationPreferences;
  communication: CommunicationPreference[];
  privacy: PrivacySettings;
  accessibility?: {
    largeText?: boolean;
    highContrast?: boolean;
    screenReader?: boolean;
    reduceMotion?: boolean;
  };
  theme?: 'light' | 'dark' | 'system';
}

export interface VitalSigns {
  systolic: number;
  diastolic: number;
  pulse?: number;
  recordedAt: ISODateString;
}

export interface PatientMetrics {
  height?: number;
  weight?: number;
  bmi?: number;
  bloodPressure?: VitalSigns;
  heartRate?: number;
  temperature?: number;
  glucose?: {
    value: number;
    type: 'fasting' | 'postprandial' | 'random';
    recordedAt: ISODateString;
  };
  cholesterol?: {
    total: number;
    hdl: number;
    ldl: number;
    triglycerides: number;
    recordedAt: ISODateString;
  };
  lastVitalsUpdate?: ISODateString;
  healthScore?: number;
  riskFactors?: string[];
  bodyFat?: number;
  muscleMass?: number;
  hydration?: number;
}

export interface PatientDocument {
  id: ID;
  type: DocumentType;
  name: string;
  url: string;
  thumbnailUrl?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: ISODateString;
  verified: boolean;
  verifiedAt?: ISODateString;
  verifiedBy?: ID;
  notes?: string;
  tags?: string[];
  expiryDate?: ISODateString;
}

export interface PatientConsent {
  id?: ID;
  type: ConsentType;
  version: string;
  acceptedAt: ISODateString;
  acceptedBy: ID;
  ipAddress?: string;
  userAgent?: string;
}

export interface PatientFamilyMember {
  id: ID;
  name: string;
  relationship: string;
  relationshipType?: RelationshipType;
  dateOfBirth?: ISODateString;
  gender?: Gender;
  isDependent?: boolean;
  consentToShare?: boolean;
  emergencyContact?: boolean;
  medicalHistory?: MedicalHistorySummary;
}

// ============================================================================
// MAIN PATIENT ENTITY (Enhanced with bio and missing fields)
// ============================================================================

export interface Patient extends Timestamps {
  readonly id: ID;
  readonly userId: ID;
  readonly tenantId?: ID;

  // Basic Info
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly bio?: string; // ✅ ADDED - For profile bio
  readonly gender?: Gender;
  readonly dateOfBirth?: ISODateString;
  readonly age?: number;
  readonly bloodGroup?: BloodGroup;
  readonly maritalStatus?: MaritalStatus;
  readonly profilePicture?: string;
  readonly occupation?: string;
  readonly nationality?: string;
  readonly religion?: string;
  
  // Addresses
  readonly address?: Address;
  readonly alternateAddress?: Address;
  
  // Contacts
  readonly emergencyContacts: EmergencyContact[];
  
  // Medical
  readonly medicalHistory?: MedicalHistorySummary;
  readonly metrics?: PatientMetrics;
  readonly documents?: PatientDocument[];
  
  // Insurance
  readonly insurance?: InsuranceInfo[];
  
  // Preferences
  readonly preferences: PatientPreferences;
  readonly preferredLanguage?: string;
  readonly preferredDoctorIds?: ID[];
  readonly preferredHospitalIds?: ID[];
  readonly preferredPharmacyIds?: ID[];
  
  // Status
  readonly status: PatientStatus;
  readonly type: PatientType;
  readonly loyaltyTier: LoyaltyTier;
  readonly loyaltyPoints: number;
  
  // Verification
  readonly isEmailVerified: boolean;
  readonly isPhoneVerified: boolean;
  readonly isIdentityVerified: boolean;
  readonly verificationDocuments?: PatientDocument[];
  readonly verificationStatus?: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  
  // Financial
  readonly totalSpent: number;
  readonly outstandingBalance: number;
  readonly creditLimit?: number;
  readonly paymentMethods?: Array<{
    id: ID;
    type: 'card' | 'bank' | 'upi';
    last4?: string;
    isDefault: boolean;
  }>;
  
  // Family
  readonly familyMembers?: PatientFamilyMember[];
  readonly primaryCarePhysician?: ID;
  readonly referredBy?: ID;
  
  // Legal & Consent
  readonly consents: PatientConsent[];
  readonly termsAcceptedVersion?: string;
  readonly privacyAcceptedVersion?: string;
  readonly hipaaAcceptedAt?: ISODateString;
  readonly dataDeletionRequested?: boolean;
  readonly dataDeletionRequestedAt?: ISODateString;
  readonly dataDeletionCompletedAt?: ISODateString;
  
  // Statistics
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
  readonly averageRating?: number;
  readonly reviewCount?: number;
  
  // Audit
  readonly version: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly deletedAt?: ISODateString;
  readonly deletedBy?: ID;
  readonly lastLoginAt?: ISODateString;
  readonly lastIpAddress?: string;
  readonly lastUserAgent?: string;
  readonly loginCount?: number;
}

// ============================================================================
// PAYLOAD TYPES (Enhanced)
// ============================================================================

export interface UpdatePatientProfilePayload {
  name?: string;
  phone?: string;
  bio?: string; // ✅ ADDED
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
  profilePicture?: string;
}

export interface ProfilePictureUploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    thumbnailUrl?: string;
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
  // Added fields
  totalMedications?: number;
  totalAllergies?: number;
  upcomingAppointmentsCount?: number;
  pendingReportsCount?: number;
}

// ============================================================================
// HELPER TYPES (New)
// ============================================================================

export interface PatientFilterParams {
  status?: PatientStatus[];
  type?: PatientType[];
  bloodGroup?: BloodGroup[];
  ageRange?: { min: number; max: number };
  dateRange?: { from: ISODateString; to: ISODateString };
  search?: string;
  isActive?: boolean;
  loyaltyTier?: LoyaltyTier[];
  insuranceProvider?: string[];
  preferredDoctorId?: ID;
  preferredHospitalId?: ID;
}

export interface PatientSortOptions {
  field: keyof Patient;
  order: 'asc' | 'desc';
}

export interface PatientBulkOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'archive' | 'updateTier';
  patientIds: ID[];
  data?: any;
}

// ============================================================================
// TYPE GUARDS (New)
// ============================================================================

export const isPatientActive = (patient: Patient): boolean => {
  return patient.isActive && patient.status === PatientStatus.ACTIVE;
};

export const isPatientVerified = (patient: Patient): boolean => {
  return patient.isEmailVerified && patient.isPhoneVerified;
};

export const getPatientFullName = (patient: Patient): string => {
  return patient.name;
};

export const getPatientAge = (patient: Patient): number | undefined => {
  if (!patient.dateOfBirth) return undefined;
  const today = new Date();
  const birthDate = new Date(patient.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getPrimaryEmergencyContact = (patient: Patient): EmergencyContact | undefined => {
  return patient.emergencyContacts?.find(contact => contact.isPrimary) || patient.emergencyContacts?.[0];
};

export const getPrimaryInsurance = (patient: Patient): InsuranceInfo | undefined => {
  return patient.insurance?.find(ins => ins.isPrimary) || patient.insurance?.[0];
};