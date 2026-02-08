/**
 * Routes accessible by PATIENT role
 */
export const PATIENT_ROUTES = [
  {
    path: "/patient/dashboard",
    label: "Dashboard",
  },
  {
    path: "/patient/appointments",
    label: "Appointments",
  },
  {
    path: "/patient/prescriptions",
    label: "Prescriptions",
  },
  {
    path: "/patient/profile",
    label: "Profile",
  },
] as const;
