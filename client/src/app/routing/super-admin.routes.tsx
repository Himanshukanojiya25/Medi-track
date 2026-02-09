import { RouteObject } from "react-router-dom";

export const superAdminRoutes: RouteObject[] = [
  {
    path: "/super-admin",
    element: null, // SuperAdminLayout
    children: [
      { index: true, element: null }, // Dashboard
      { path: "hospitals", element: null },
      { path: "approvals", element: null },
      { path: "analytics", element: null },
      { path: "revenue", element: null },
      { path: "system-health", element: null },
      { path: "logs", element: null },
    ],
  },
];
