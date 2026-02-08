/**
 * Routes accessible by SUPER_ADMIN role
 */
export const SUPER_ADMIN_ROUTES = [
  {
    path: "/super-admin/dashboard",
    label: "Dashboard",
  },
  {
    path: "/super-admin/hospitals",
    label: "Hospitals",
  },
  {
    path: "/super-admin/subscriptions",
    label: "Subscriptions",
  },
  {
    path: "/super-admin/system-health",
    label: "System Health",
  },
] as const;
