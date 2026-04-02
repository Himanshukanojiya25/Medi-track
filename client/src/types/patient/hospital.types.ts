// client/src/types/patient/hospital.types.ts

import type { ID, ISODateString, Timestamps } from '../shared';

// DO NOT import Doctor from doctor.types.ts - this creates circular dependency

// ============================================================================
// ENUMS
// ============================================================================

export enum HospitalType {
  GENERAL = 'GENERAL',
  SPECIALTY = 'SPECIALTY',
  MULTI_SPECIALTY = 'MULTI_SPECIALTY',
  SUPER_SPECIALTY = 'SUPER_SPECIALTY',
  TEACHING = 'TEACHING',
  RESEARCH = 'RESEARCH',
  CLINIC = 'CLINIC',
}

export enum HospitalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

// ============================================================================
// SIMPLIFIED DOCTOR TYPE (to avoid circular dependency)
// ============================================================================

export interface SimpleDoctor {
  readonly id: ID;
  readonly name: string;
  readonly specialization?: string;
  readonly profilePicture?: string;
  readonly rating?: number;
  readonly experience?: number;
  readonly consultationFee?: number;
}

// ============================================================================
// MAIN HOSPITAL INTERFACE
// ============================================================================

export interface Hospital extends Timestamps {
  readonly id: ID;
  readonly name: string;
  readonly code: string;
  readonly type: HospitalType;
  readonly status: HospitalStatus;
  readonly description?: string;
  
  // Contact Information
  readonly email: string;
  readonly phone: string;
  readonly emergencyPhone?: string;
  readonly address: HospitalAddress;
  readonly website?: string;
  
  // Media
  readonly logo?: string;
  readonly coverImage?: string;
  readonly gallery?: string[];
  
  // Ratings
  readonly rating: number;
  readonly totalReviews: number;
  
  // Statistics
  readonly totalDoctors: number;
  readonly totalDepartments: number;
  readonly totalBeds: number;
  readonly availableBeds?: number;
  
  // Facilities & Services
  readonly facilities: HospitalFacility[];
  readonly departments: HospitalDepartment[];
  readonly specialities: string[];
  
  // Timings
  readonly opdTimings: HospitalTimings;
  readonly emergencyServices: boolean;
  readonly ambulanceAvailable: boolean;
  readonly ambulanceContact?: string;
  
  // Insurance
  readonly insuranceAccepted: string[];
  
  // Additional Info
  readonly establishedYear?: number;
  readonly accreditation?: string[];
  readonly awards?: string[];
  readonly nearbyLandmarks?: string[];
}

export interface HospitalAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface HospitalTimings {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
  holidays?: ISODateString[];
}

export interface HospitalFacility {
  id: ID;
  name: string;
  description?: string;
  icon?: string;
  available: boolean;
}

export interface HospitalDepartment {
  id: ID;
  name: string;
  description?: string;
  headOfDepartment?: string;
  totalDoctors: number;
  phone?: string;
  location?: string;
}

export interface HospitalProfile extends Hospital {
  readonly doctors: SimpleDoctor[]; // Use SimpleDoctor instead of Doctor
  readonly latestReviews: HospitalReview[];
  readonly statistics: HospitalStatistics;
  readonly nearbyHospitals?: Hospital[];
}

export interface HospitalReview extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly patientName: string;
  readonly patientAvatar?: string;
  readonly rating: number;
  readonly review: string;
  readonly tags?: string[];
  readonly helpful: number;
  readonly reply?: string;
  readonly repliedAt?: ISODateString;
}

export interface HospitalRating {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categories?: {
    cleanliness: number;
    staffBehavior: number;
    waitingTime: number;
    treatmentQuality: number;
    infrastructure: number;
  };
}

export interface HospitalStatistics {
  totalAppointments: number;
  totalPatients: number;
  totalRevenue: number;
  occupancyRate: number;
  averageWaitTime: number;
  patientSatisfaction: number;
  readmissionRate: number;
}

// ============================================================================
// FILTERS & PAYLOADS
// ============================================================================

export interface HospitalFilters {
  type?: HospitalType | HospitalType[];
  city?: string;
  state?: string;
  rating?: number;
  speciality?: string;
  facility?: string;
  insurance?: string;
  emergencyServices?: boolean;
  ambulanceAvailable?: boolean;
  search?: string;
  sortBy?: 'rating' | 'name' | 'distance';
  sortOrder?: 'asc' | 'desc';
}