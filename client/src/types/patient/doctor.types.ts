// client/src/types/patient/doctor.types.ts

import type { ID, ISODateString, Timestamps } from '../shared';

// ============================================================================
// ENUMS WITH DISPLAY VALUES
// ============================================================================

export enum DoctorSpeciality {
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  PEDIATRICS = 'PEDIATRICS',
  ORTHOPEDICS = 'ORTHOPEDICS',
  GYNECOLOGY = 'GYNECOLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  PSYCHIATRY = 'PSYCHIATRY',
  RADIOLOGY = 'RADIOLOGY',
  SURGERY = 'SURGERY',
  UROLOGY = 'UROLOGY',
  ENT = 'ENT',
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  EMERGENCY_MEDICINE = 'EMERGENCY_MEDICINE',
  ANESTHESIOLOGY = 'ANESTHESIOLOGY',
  PATHOLOGY = 'PATHOLOGY',
  NEPHROLOGY = 'NEPHROLOGY',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  HEMATOLOGY = 'HEMATOLOGY',
  ONCOLOGY = 'ONCOLOGY',
  RHEUMATOLOGY = 'RHEUMATOLOGY',
  INFECTIOUS_DISEASE = 'INFECTIOUS_DISEASE',
}

// Speciality display names mapping
export const DoctorSpecialityDisplay: Record<DoctorSpeciality, string> = {
  [DoctorSpeciality.CARDIOLOGY]: 'Cardiology',
  [DoctorSpeciality.DERMATOLOGY]: 'Dermatology',
  [DoctorSpeciality.NEUROLOGY]: 'Neurology',
  [DoctorSpeciality.PEDIATRICS]: 'Pediatrics',
  [DoctorSpeciality.ORTHOPEDICS]: 'Orthopedics',
  [DoctorSpeciality.GYNECOLOGY]: 'Gynecology',
  [DoctorSpeciality.OPHTHALMOLOGY]: 'Ophthalmology',
  [DoctorSpeciality.PSYCHIATRY]: 'Psychiatry',
  [DoctorSpeciality.RADIOLOGY]: 'Radiology',
  [DoctorSpeciality.SURGERY]: 'Surgery',
  [DoctorSpeciality.UROLOGY]: 'Urology',
  [DoctorSpeciality.ENT]: 'ENT Specialist',
  [DoctorSpeciality.GENERAL_MEDICINE]: 'General Medicine',
  [DoctorSpeciality.EMERGENCY_MEDICINE]: 'Emergency Medicine',
  [DoctorSpeciality.ANESTHESIOLOGY]: 'Anesthesiology',
  [DoctorSpeciality.PATHOLOGY]: 'Pathology',
  [DoctorSpeciality.NEPHROLOGY]: 'Nephrology',
  [DoctorSpeciality.ENDOCRINOLOGY]: 'Endocrinology',
  [DoctorSpeciality.HEMATOLOGY]: 'Hematology',
  [DoctorSpeciality.ONCOLOGY]: 'Oncology',
  [DoctorSpeciality.RHEUMATOLOGY]: 'Rheumatology',
  [DoctorSpeciality.INFECTIOUS_DISEASE]: 'Infectious Disease',
};

export enum DoctorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
  AWAY = 'AWAY',
}

export const DoctorStatusDisplay: Record<DoctorStatus, { label: string; color: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  [DoctorStatus.ACTIVE]: { label: 'Active', color: 'success' },
  [DoctorStatus.INACTIVE]: { label: 'Inactive', color: 'default' },
  [DoctorStatus.ON_LEAVE]: { label: 'On Leave', color: 'warning' },
  [DoctorStatus.SUSPENDED]: { label: 'Suspended', color: 'danger' },
  [DoctorStatus.AVAILABLE]: { label: 'Available', color: 'success' },
  [DoctorStatus.BUSY]: { label: 'Busy', color: 'warning' },
  [DoctorStatus.OFFLINE]: { label: 'Offline', color: 'default' },
  [DoctorStatus.AWAY]: { label: 'Away', color: 'info' },
};

export enum ConsultationFeeType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  PER_VISIT = 'PER_VISIT',
}

export enum ConsultationMode {
  IN_PERSON = 'in-person',
  VIDEO = 'video',
  PHONE = 'phone',
}

export enum SortBy {
  RATING = 'rating',
  EXPERIENCE = 'experience',
  FEE_LOW_TO_HIGH = 'fee_low_to_high',
  FEE_HIGH_TO_LOW = 'fee_high_to_low',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};

// ============================================================================
// SIMPLIFIED HOSPITAL TYPE (to avoid circular dependency)
// ============================================================================

export interface SimpleHospital {
  readonly id: ID;
  readonly name: string;
  readonly city?: string;
  readonly state?: string;
  readonly pincode?: string;
  readonly rating?: number;
  readonly logo?: string;
  readonly isVerified?: boolean;
}

// ============================================================================
// MAIN DOCTOR INTERFACE
// ============================================================================

export interface Doctor extends Timestamps {
  readonly id: ID;
  readonly userId: ID;
  readonly hospitalId?: ID;
  
  // Basic Information
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly profilePicture?: Nullable<string>;
  readonly specialization: DoctorSpeciality;
  readonly qualifications: readonly string[];
  readonly experience: number; // in years
  readonly languages: readonly string[];
  readonly bio?: Nullable<string>;
  readonly gender?: 'MALE' | 'FEMALE' | 'OTHER';
  
  // Practice Details
  readonly hospital?: Nullable<SimpleHospital>;
  readonly department?: Nullable<string>;
  readonly consultationFee: number;
  readonly feeType: ConsultationFeeType;
  readonly availableSlots?: Nullable<DoctorAvailabilitySlot[]>;
  
  // Ratings & Statistics
  readonly rating: number; // 0-5
  readonly totalReviews: number;
  readonly totalPatients: number;
  readonly completionRate?: number; // percentage
  readonly responseRate?: number; // percentage
  readonly averageResponseTime?: string; // e.g., "2 hours"
  
  // Status
  readonly status: DoctorStatus;
  readonly isVerified: boolean;
  readonly isAvailableToday: boolean;
  readonly nextAvailableSlot?: Nullable<string>;
  
  // Professional Info
  readonly registrationNumber?: Nullable<string>;
  readonly registrationCouncil?: Nullable<string>;
  readonly registrationYear?: Nullable<number>;
  readonly awards?: readonly string[];
  readonly publications?: readonly string[];
  readonly memberships?: readonly string[];
  
  // Social/Contact
  readonly clinicAddress?: Nullable<string>;
  readonly clinicCity?: Nullable<string>;
  readonly clinicPincode?: Nullable<string>;
  readonly website?: Nullable<string>;
  readonly socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

// ============================================================================
// AVAILABILITY TYPES
// ============================================================================

export interface DoctorAvailabilitySlot {
  readonly day: string; // Monday, Tuesday, etc.
  readonly startTime: string; // HH:MM format
  readonly endTime: string; // HH:MM format
  readonly isAvailable: boolean;
  readonly breakSlots?: readonly { start: string; end: string }[];
  readonly maxAppointmentsPerDay?: number;
  readonly bookedAppointments?: number;
}

export interface DoctorTimeSlot {
  readonly time: string; // HH:MM format
  readonly isAvailable: boolean;
  readonly appointmentId?: ID;
}

export interface DoctorAvailabilityResponse {
  readonly doctorId: ID;
  readonly date: ISODateString;
  readonly slots: DoctorTimeSlot[];
  readonly isHoliday: boolean;
  readonly holidayReason?: string;
}

// ============================================================================
// PROFILE TYPES
// ============================================================================

export interface DoctorEducation {
  readonly degree: string;
  readonly institution: string;
  readonly university?: string;
  readonly year: number;
  readonly grade?: string;
}

export interface DoctorExperience {
  readonly position: string;
  readonly hospital: string;
  readonly location?: string;
  readonly fromYear: number;
  readonly toYear?: Nullable<number>;
  readonly current?: boolean;
  readonly description?: string;
}

export interface DoctorProfile extends Doctor {
  readonly education: readonly DoctorEducation[];
  readonly experienceDetails: readonly DoctorExperience[];
  readonly specialties: readonly string[];
  readonly services: readonly string[];
  readonly averageWaitTime?: number; // in minutes
  readonly consultationModes: readonly ConsultationMode[];
  readonly insuranceAccepted?: readonly string[];
  readonly emergencyContact?: {
    phone: string;
    name: string;
    relation: string;
  };
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface DoctorReview extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly patientName: string;
  readonly patientAvatar?: Nullable<string>;
  readonly appointmentId?: ID;
  readonly rating: number; // 1-5
  readonly review: string;
  readonly tags?: readonly string[];
  readonly helpful: number;
  readonly isVerifiedPurchase: boolean;
  readonly repliedByDoctor: boolean;
  readonly reply?: Nullable<string>;
  readonly repliedAt?: Nullable<ISODateString>;
  readonly doctorComment?: Nullable<string>;
}

export interface DoctorRatingDistribution {
  readonly 1: number;
  readonly 2: number;
  readonly 3: number;
  readonly 4: number;
  readonly 5: number;
}

export interface DoctorRating {
  readonly average: number;
  readonly total: number;
  readonly distribution: DoctorRatingDistribution;
}

// ============================================================================
// FILTERS & QUERY PARAMS
// ============================================================================

export interface DoctorFilters {
  readonly specialization?: DoctorSpeciality | readonly DoctorSpeciality[];
  readonly hospitalId?: ID;
  readonly minRating?: number; // 0-5
  readonly minExperience?: number;
  readonly maxFee?: number;
  readonly minFee?: number;
  readonly language?: string;
  readonly gender?: 'MALE' | 'FEMALE' | 'OTHER';
  readonly availableToday?: boolean;
  readonly consultationMode?: ConsultationMode;
  readonly search?: string;
  readonly isVerified?: boolean;
  readonly sortBy?: SortBy;
}

export interface DoctorListQueryParams extends DoctorFilters {
  readonly page?: number;
  readonly limit?: number;
  readonly cursor?: string; // for cursor-based pagination
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface DoctorListResponse {
  readonly success: boolean;
  readonly data: readonly Doctor[];
  readonly pagination?: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPrevPage: boolean;
  };
  readonly cursor?: {
    readonly nextCursor: string | null;
    readonly prevCursor: string | null;
  };
  readonly message?: string;
  readonly timestamp: ISODateString;
}

export interface DoctorResponse {
  readonly success: boolean;
  readonly data: Doctor;
  readonly message?: string;
  readonly timestamp: ISODateString;
}

export interface DoctorProfileResponse {
  readonly success: boolean;
  readonly data: DoctorProfile;
  readonly message?: string;
  readonly timestamp: ISODateString;
}

export interface DoctorReviewsResponse {
  readonly success: boolean;
  readonly data: readonly DoctorReview[];
  readonly rating: DoctorRating;
  readonly pagination?: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
  readonly timestamp: ISODateString;
}

export interface DoctorAvailabilityResponse {
  readonly success: boolean;
  readonly data: DoctorAvailabilityResponse[];
  readonly message?: string;
  readonly timestamp: ISODateString;
}

// ============================================================================
// FAVORITE TYPES
// ============================================================================

export interface FavoriteDoctor {
  readonly id: ID;
  readonly patientId: ID;
  readonly doctorId: ID;
  readonly doctor: Doctor;
  readonly createdAt: ISODateString;
}

export interface FavoriteDoctorsResponse {
  readonly success: boolean;
  readonly data: readonly FavoriteDoctor[];
  readonly total: number;
  readonly timestamp: ISODateString;
}

export interface FavoriteStatusResponse {
  readonly success: boolean;
  readonly data: {
    readonly isFavorite: boolean;
    readonly favoriteId?: ID;
  };
  readonly timestamp: ISODateString;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isDoctor = (value: unknown): value is Doctor => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'specialization' in value
  );
};

export const isDoctorProfile = (value: unknown): value is DoctorProfile => {
  return isDoctor(value) && 'education' in value && 'experienceDetails' in value;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getSpecialityDisplay = (speciality: DoctorSpeciality): string => {
  return DoctorSpecialityDisplay[speciality] || speciality;
};

export const getStatusDisplay = (status: DoctorStatus): { label: string; color: 'success' | 'warning' | 'danger' | 'info' | 'default' } => {
  return DoctorStatusDisplay[status] || { label: status, color: 'default' };
};

export const formatConsultationFee = (fee: number, feeType: ConsultationFeeType): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });
  
  const feeString = formatter.format(fee);
  
  switch (feeType) {
    case ConsultationFeeType.HOURLY:
      return `${feeString}/hour`;
    case ConsultationFeeType.PER_VISIT:
      return `${feeString}/visit`;
    default:
      return feeString;
  }
};

export const calculateExperienceLevel = (years: number): 'Entry' | 'Mid' | 'Senior' | 'Expert' => {
  if (years < 3) return 'Entry';
  if (years < 8) return 'Mid';
  if (years < 15) return 'Senior';
  return 'Expert';
};