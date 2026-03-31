// client/src/app/constants/role.constants.ts

export const ROLES = {
  PUBLIC: "public",
  PATIENT: "patient",
  DOCTOR: "doctor",
  HOSPITAL_ADMIN: "hospital_admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  public: 0,
  patient: 1,
  doctor: 2,
  hospital_admin: 3,
  super_admin: 4,
};

// Dashboard routes for each role
export const ROLE_DASHBOARD_ROUTES: Record<AppRole, string> = {
  public: '/',
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  hospital_admin: '/hospital-admin/dashboard',
  super_admin: '/super-admin/dashboard',
};

// Display names for roles
export const ROLE_DISPLAY_NAMES: Record<AppRole, string> = {
  public: 'Guest',
  patient: 'Patient',
  doctor: 'Doctor',
  hospital_admin: 'Hospital Administrator',
  super_admin: 'Super Administrator',
};

// Role-based permissions
export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  public: ['view_public_content'],
  patient: [
    'view_own_profile',
    'edit_own_profile',
    'book_appointment',
    'view_appointments',
    'cancel_appointment',
    'reschedule_appointment',
    'view_prescriptions',
    'upload_reports',
    'view_medical_history',
    'add_favorites',
    'submit_feedback',
  ],
  doctor: [
    'view_own_profile',
    'edit_own_profile',
    'view_appointments',
    'manage_availability',
    'view_patient_details',
    'write_prescriptions',
    'view_patient_history',
    'update_appointment_status',
  ],
  hospital_admin: [
    'view_all_doctors',
    'manage_doctors',
    'view_all_patients',
    'manage_departments',
    'view_revenue',
    'manage_hospital_settings',
    'view_analytics',
    'manage_appointments',
  ],
  super_admin: [
    'view_all_users',
    'manage_all_users',
    'view_all_hospitals',
    'manage_hospitals',
    'view_system_analytics',
    'manage_system_settings',
    'view_audit_logs',
    'manage_subscriptions',
    'approve_hospitals',
  ],
};