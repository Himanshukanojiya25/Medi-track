// client/src/types/patient/doctor.types.ts

import type { ID, ISODateString, Timestamps } from '../shared';

// ============================================================================
// ENUMS
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
}

export enum DoctorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
}

export enum ConsultationFeeType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  PER_VISIT = 'PER_VISIT',
}

// ============================================================================
// SIMPLIFIED HOSPITAL TYPE (to avoid circular dependency)
// ============================================================================

export interface SimpleHospital {
  readonly id: ID;
  readonly name: string;
  readonly city?: string;
  readonly state?: string;
  readonly rating?: number;
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
  readonly profilePicture?: string;
  readonly specialization: DoctorSpeciality;
  readonly qualifications: string[];
  readonly experience: number; // in years
  readonly languages: string[];
  readonly bio?: string;
  
  // Practice Details
  readonly hospital?: SimpleHospital; // Use SimpleHospital
  readonly department?: string;
  readonly consultationFee: number;
  readonly feeType: ConsultationFeeType;
  readonly availableSlots?: DoctorAvailabilitySlot[];
  
  // Ratings
  readonly rating: number;
  readonly totalReviews: number;
  readonly totalPatients: number;
  
  // Status
  readonly status: DoctorStatus;
  readonly isVerified: boolean;
  readonly isAvailableToday: boolean;
  
  // Additional Info
  readonly registrationNumber?: string;
  readonly registrationCouncil?: string;
  readonly awards?: string[];
  readonly publications?: string[];
  readonly memberships?: string[];
}

export interface DoctorAvailabilitySlot {
  day: string; // Monday, Tuesday, etc.
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakSlots?: Array<{ start: string; end: string }>;
}

export interface DoctorProfile extends Doctor {
  readonly education: DoctorEducation[];
  readonly experienceDetails: DoctorExperience[];
  readonly specialties: string[];
  readonly services: string[];
  readonly averageWaitTime?: number;
  readonly nextAvailableSlot?: string;
  readonly consultationModes: ('in-person' | 'video' | 'phone')[];
}

export interface DoctorEducation {
  degree: string;
  institution: string;
  year: number;
}

export interface DoctorExperience {
  position: string;
  hospital: string;
  fromYear: number;
  toYear?: number;
  current?: boolean;
}

export interface DoctorReview extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly patientName: string;
  readonly patientAvatar?: string;
  readonly appointmentId?: ID;
  readonly rating: number;
  readonly review: string;
  readonly tags?: string[];
  readonly helpful: number;
  readonly repliedByDoctor?: boolean;
  readonly reply?: string;
  readonly repliedAt?: ISODateString;
}

export interface DoctorRating {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface DoctorAvailability {
  slots: DoctorAvailabilitySlot[];
  exceptions?: Array<{
    date: ISODateString;
    isAvailable: boolean;
    slots?: string[];
  }>;
}

// ============================================================================
// FILTERS & PAYLOADS
// ============================================================================

export interface DoctorFilters {
  specialization?: DoctorSpeciality | DoctorSpeciality[];
  hospitalId?: ID;
  rating?: number;
  minExperience?: number;
  maxFee?: number;
  language?: string;
  gender?: string;
  availableToday?: boolean;
  consultationMode?: 'in-person' | 'video' | 'phone';
  search?: string;
  sortBy?: 'rating' | 'experience' | 'fee' | 'name';
  sortOrder?: 'asc' | 'desc';
}