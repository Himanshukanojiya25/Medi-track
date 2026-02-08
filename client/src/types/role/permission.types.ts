/**
 * Permission keys used across UI & guards
 * Must stay aligned with backend constants
 */
export enum Permission {
  // Hospital
  HOSPITAL_VIEW = "HOSPITAL_VIEW",
  HOSPITAL_MANAGE = "HOSPITAL_MANAGE",

  // Doctor
  DOCTOR_VIEW = "DOCTOR_VIEW",
  DOCTOR_MANAGE = "DOCTOR_MANAGE",

  // Patient
  PATIENT_VIEW = "PATIENT_VIEW",
  PATIENT_MANAGE = "PATIENT_MANAGE",

  // Appointment
  APPOINTMENT_VIEW = "APPOINTMENT_VIEW",
  APPOINTMENT_MANAGE = "APPOINTMENT_MANAGE",

  // Billing
  BILLING_VIEW = "BILLING_VIEW",
  BILLING_MANAGE = "BILLING_MANAGE",

  // System
  SYSTEM_AUDIT_VIEW = "SYSTEM_AUDIT_VIEW",
}
