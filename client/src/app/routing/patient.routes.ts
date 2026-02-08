import { RouteObject } from "react-router-dom";

export const patientRoutes: RouteObject[] = [
  {
    path: "/patient",
    element: null, // PatientLayout
    children: [
      { index: true, element: null }, // Dashboard
      { path: "appointments", element: null },
      { path: "appointments/:appointmentId", element: null },
      { path: "prescriptions", element: null },
      { path: "notifications", element: null },
      { path: "profile", element: null },
      { path: "settings", element: null },
    ],
  },
];
