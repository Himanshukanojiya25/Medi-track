import { RouteObject } from "react-router-dom";

export const patientRoutes: RouteObject[] = [
  {
    path: "/patient",
    element: null, // PatientLayout (Phase 2)
    children: [
      { index: true, element: null },
      { path: "appointments", element: null },
      { path: "records", element: null },
      { path: "billing", element: null },
      { path: "settings", element: null },
    ],
  },
];
