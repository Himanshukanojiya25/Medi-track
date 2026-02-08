/**
 * Routes accessible by HOSPITAL_ADMIN role
 */
export const HOSPITAL_ADMIN_ROUTES = [
  {
    path: "/hospital-admin/dashboard",
    label: "Dashboard",
  },
  {
    path: "/hospital-admin/doctors",
    label: "Doctors",
  },
  {
    path: "/hospital-admin/departments",
    label: "Departments",
  },
  {
    path: "/hospital-admin/billing",
    label: "Billing",
  },
] as const;
