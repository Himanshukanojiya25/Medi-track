// client/src/types/appointment/appointment.types.ts

import type { ID, Timestamps, ISODateString } from "../shared";

/**
 * Appointment Status Enum - Comprehensive status workflow
 */
export enum AppointmentStatus {
  // Booking phase
  PENDING = "PENDING",
  REQUESTED = "REQUESTED",
  CONFIRMED = "CONFIRMED",
  
  // Pre-appointment
  CHECKED_IN = "CHECKED_IN",
  WAITING = "WAITING",
  READY = "READY",
  
  // In-progress
  IN_PROGRESS = "IN_PROGRESS",
  WITH_DOCTOR = "WITH_DOCTOR",
  
  // Completion
  COMPLETED = "COMPLETED",
  FOLLOW_UP_NEEDED = "FOLLOW_UP_NEEDED",
  
  // Cancellation reasons
  CANCELLED_BY_PATIENT = "CANCELLED_BY_PATIENT",
  CANCELLED_BY_DOCTOR = "CANCELLED_BY_DOCTOR",
  CANCELLED_BY_HOSPITAL = "CANCELLED_BY_HOSPITAL",
  
  // No-show
  NO_SHOW_PATIENT = "NO_SHOW_PATIENT",
  NO_SHOW_DOCTOR = "NO_SHOW_DOCTOR",
  
  // Reschedule
  RESCHEDULED = "RESCHEDULED",
  RESCHEDULE_REQUESTED = "RESCHEDULE_REQUESTED",
  
  // Emergency
  EMERGENCY = "EMERGENCY",
  
  // System
  MISSED = "MISSED",
  EXPIRED = "EXPIRED",
}

/**
 * Appointment Type
 */
export enum AppointmentType {
  IN_PERSON = "IN_PERSON",
  VIDEO_CALL = "VIDEO_CALL",
  PHONE_CALL = "PHONE_CALL",
  HOME_VISIT = "HOME_VISIT",
  EMERGENCY = "EMERGENCY",
  FOLLOW_UP = "FOLLOW_UP",
  CONSULTATION = "CONSULTATION",
  PROCEDURE = "PROCEDURE",
  SURGERY = "SURGERY",
  VACCINATION = "VACCINATION",
  LAB_TEST = "LAB_TEST",
  IMAGING = "IMAGING",
}

/**
 * Appointment Priority
 */
export enum AppointmentPriority {
  ROUTINE = "ROUTINE",
  URGENT = "URGENT",
  EMERGENCY = "EMERGENCY",
  CRITICAL = "CRITICAL",
}

/**
 * Payment Status for Appointment
 */
export enum AppointmentPaymentStatus {
  PENDING = "PENDING",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  INSURANCE_PENDING = "INSURANCE_PENDING",
  INSURANCE_APPROVED = "INSURANCE_APPROVED",
  INSURANCE_DENIED = "INSURANCE_DENIED",
  WAIVED = "WAIVED",
}

/**
 * Location/Department Information
 */
export interface AppointmentLocation {
  id?: ID;
  name: string;
  address: string;
  room?: string;
  floor?: string;
  building?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  instructions?: string;
}

/**
 * Virtual Meeting Details
 */
export interface VirtualMeetingDetails {
  platform: "zoom" | "teams" | "google_meet" | "custom";
  meetingId: string;
  passcode?: string;
  joinUrl: string;
  hostUrl?: string;
  alternativeUrls?: string[];
}

/**
 * Doctor Information (Denormalized for quick access)
 */
export interface AppointmentDoctor {
  id: ID;
  name: string;
  specialty: string;
  department?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  experience?: number;
  rating?: number;
}

/**
 * Patient Information (Denormalized for quick access)
 */
export interface AppointmentPatient {
  id: ID;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  profilePicture?: string;
  medicalHistory?: string[];
}

/**
 * Hospital Information
 */
export interface AppointmentHospital {
  id: ID;
  name: string;
  branch?: string;
  phone?: string;
  email?: string;
}

/**
 * Insurance Information
 */
export interface AppointmentInsurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  coverageAmount?: number;
  copay?: number;
  authorizationCode?: string;
  authorizationStatus?: "pending" | "approved" | "denied";
}

/**
 * Billing Information
 */
export interface AppointmentBilling {
  consultationFee: number;
  additionalFees: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  currency: string;
  paymentStatus: AppointmentPaymentStatus;
  paymentMethod?: "cash" | "card" | "insurance" | "online" | "wallet";
  paymentReference?: string;
  invoiceId?: string;
  insuranceClaimId?: string;
}

/**
 * Reminder Configuration
 */
export interface AppointmentReminders {
  sms?: boolean;
  email?: boolean;
  push?: boolean;
  reminderHours: number[];
  lastReminderSent?: ISODateString;
  confirmationSent?: boolean;
  confirmationReceived?: boolean;
}

/**
 * Waitlist Information
 */
export interface WaitlistInfo {
  isOnWaitlist: boolean;
  position?: number;
  estimatedWaitTime?: number;
  notified?: boolean;
}

/**
 * Reschedule History
 */
export interface RescheduleHistory {
  previousDate: ISODateString;
  newDate: ISODateString;
  reason?: string;
  requestedBy: "patient" | "doctor" | "hospital";
  status: "requested" | "approved" | "denied";
  approvedAt?: ISODateString;
  approvedBy?: ID;
}

/**
 * Feedback/Review
 */
export interface AppointmentFeedback {
  rating: number;
  review?: string;
  doctorFeedback?: string;
  hospitalFeedback?: string;
  submittedAt?: ISODateString;
  tags?: string[];
}

/**
 * Audit Log Entry
 */
export interface AppointmentAuditLog {
  action: string;
  performedBy: ID;
  performedByRole: string;
  timestamp: ISODateString;
  previousState?: Partial<Appointment>;
  newState?: Partial<Appointment>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Main Appointment Entity - Complete Enterprise Version
 */
export interface Appointment extends Timestamps {
  // Core Identifiers
  readonly id: ID;
  readonly tenantId?: ID;
  
  // Participants
  readonly patientId: ID;
  readonly doctorId: ID;
  readonly hospitalId: ID;
  readonly departmentId?: ID;
  readonly createdBy?: ID;
  readonly assignedBy?: ID;
  
  // Denormalized Data (for performance)
  readonly patient?: AppointmentPatient;
  readonly doctor?: AppointmentDoctor;
  readonly hospital?: AppointmentHospital;
  
  // Schedule Information
  readonly scheduledAt: ISODateString;
  readonly durationMinutes: number;
  readonly startTime?: ISODateString;
  readonly endTime?: ISODateString;
  readonly timezone?: string;
  
  // Status & Tracking
  readonly status: AppointmentStatus;
  readonly type: AppointmentType;
  readonly priority: AppointmentPriority;
  readonly stage?: string;
  
  // Clinical Information
  readonly reason?: string;
  readonly symptoms?: string[];
  readonly diagnosis?: string;
  readonly prescription?: string;
  readonly notes?: string;
  readonly clinicalNotes?: string;
  readonly specialInstructions?: string;
  
  // Location & Meeting
  readonly location: AppointmentLocation;
  readonly virtualMeeting?: VirtualMeetingDetails;
  
  // Financial
  readonly billing?: AppointmentBilling;
  readonly insurance?: AppointmentInsurance;
  
  // Communication
  readonly reminders?: AppointmentReminders;
  readonly confirmedAt?: ISODateString;
  readonly confirmationMethod?: "email" | "sms" | "push" | "manual";
  
  // Cancellation
  readonly cancelledAt?: ISODateString;
  readonly cancelledBy?: ID;
  readonly cancellationReason?: string;
  readonly cancellationNotes?: string;
  
  // Reschedule
  readonly rescheduledFrom?: ID;
  readonly rescheduledTo?: ID;
  readonly rescheduleHistory?: RescheduleHistory[];
  readonly rescheduleCount?: number;
  
  // Waitlist
  readonly waitlist?: WaitlistInfo;
  
  // Feedback
  readonly feedback?: AppointmentFeedback;
  
  // Emergency
  readonly isEmergency: boolean;
  readonly emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Compliance & Legal
  readonly consentFormSigned?: boolean;
  readonly consentFormUrl?: string;
  readonly hipaaConsent?: boolean;
  readonly termsAccepted?: boolean;
  
  // Audit
  readonly auditLog?: AppointmentAuditLog[];
  
  // Metadata
  readonly metadata?: Record<string, any>;
  readonly tags?: string[];
  readonly attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  
  // System Fields
  readonly version: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly deletedAt?: ISODateString;
  readonly deletedBy?: ID;
}

/**
 * Create Appointment Payload
 */
export interface CreateAppointmentPayload {
  patientId: ID;
  doctorId: ID;
  hospitalId: ID;
  scheduledAt: ISODateString;
  durationMinutes?: number;
  type?: AppointmentType;
  priority?: AppointmentPriority;
  reason?: string;
  symptoms?: string[];
  notes?: string;
  location?: Partial<AppointmentLocation>;
  isEmergency?: boolean;
  insurance?: Partial<AppointmentInsurance>;
}

/**
 * Update Appointment Payload
 */
export interface UpdateAppointmentPayload {
  scheduledAt?: ISODateString;
  durationMinutes?: number;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
  priority?: AppointmentPriority;
  location?: Partial<AppointmentLocation>;
  virtualMeeting?: Partial<VirtualMeetingDetails>;
}

/**
 * Appointment Filters for Listing
 */
export interface AppointmentFilters {
  status?: AppointmentStatus | AppointmentStatus[];
  type?: AppointmentType | AppointmentType[];
  priority?: AppointmentPriority | AppointmentPriority[];
  patientId?: ID;
  doctorId?: ID;
  hospitalId?: ID;
  departmentId?: ID;
  startDate?: ISODateString;
  endDate?: ISODateString;
  isEmergency?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Appointment Statistics
 */
export interface AppointmentStatistics {
  total: number;
  byStatus: Record<AppointmentStatus, number>;
  byType: Record<AppointmentType, number>;
  byPriority: Record<AppointmentPriority, number>;
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  noShow: number;
  averageWaitTime: number;
  averageConsultationTime: number;
  revenue: {
    total: number;
    pending: number;
    collected: number;
  };
}

/**
 * Appointment Slot for Availability
 */
export interface AppointmentSlot {
  id?: string;
  startTime: ISODateString;
  endTime: ISODateString;
  duration: number;
  isAvailable: boolean;
  doctorId?: ID;
  hospitalId?: ID;
  bookedBy?: ID;
  price?: number;
}

/**
 * Appointment Webhook Events
 */
export type AppointmentWebhookEvent = 
  | "appointment.created"
  | "appointment.updated"
  | "appointment.confirmed"
  | "appointment.cancelled"
  | "appointment.rescheduled"
  | "appointment.completed"
  | "appointment.reminder.sent"
  | "appointment.no_show";

/**
 * Appointment Webhook Payload
 */
export interface AppointmentWebhookPayload {
  event: AppointmentWebhookEvent;
  appointmentId: ID;
  appointment: Appointment;
  timestamp: ISODateString;
  triggeredBy: ID;
}