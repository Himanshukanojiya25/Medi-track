import { RouteObject } from "react-router-dom";

export const hospitalAdminRoutes: RouteObject[] = [
  {
    path: "/hospital-admin",
    element: null, // HospitalAdminLayout
    children: [
      { index: true, element: null }, // Dashboard
      { path: "doctors", element: null },
      { path: "patients", element: null },
      { path: "appointments", element: null },
      { path: "billing", element: null },
      { path: "departments", element: null },
      { path: "analytics", element: null },
      { path: "settings", element: null },
    ],
  },
];
