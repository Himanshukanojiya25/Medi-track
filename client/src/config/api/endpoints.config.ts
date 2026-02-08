/**
 * Central API endpoint registry
 * Prevents string duplication across services
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",

  // User / profile
  USER_ME: "/users/me",

  // Hospital
  HOSPITALS: "/hospitals",
  HOSPITAL_BY_ID: (id: string) => `/hospitals/${id}`,
  DEPARTMENTS_BY_HOSPITAL: (hospitalId: string) =>
    `/hospitals/${hospitalId}/departments`,

  // Doctor
  DOCTORS: "/doctors",
  DOCTOR_BY_ID: (id: string) => `/doctors/${id}`,
  DOCTOR_AVAILABILITY: (doctorId: string) =>
    `/doctors/${doctorId}/availability`,

  // Patient
  PATIENTS: "/patients",
  PATIENT_BY_ID: (id: string) => `/patients/${id}`,

  // Appointment
  APPOINTMENTS: "/appointments",
  APPOINTMENT_BY_ID: (id: string) => `/appointments/${id}`,

  // Billing
  BILLS: "/billing/bills",
  PAYMENTS: "/billing/payments",

  // AI
  AI_CHAT: "/ai/chat",
  AI_USAGE: "/ai/usage",
} as const;
