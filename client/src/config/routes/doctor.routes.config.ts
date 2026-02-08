/**
 * Routes accessible by DOCTOR role
 */
export const DOCTOR_ROUTES = [
  {
    path: "/doctor/dashboard",
    label: "Dashboard",
  },
  {
    path: "/doctor/appointments",
    label: "Appointments",
  },
  {
    path: "/doctor/patients",
    label: "Patients",
  },
  {
    path: "/doctor/profile",
    label: "Profile",
  },
] as const;
