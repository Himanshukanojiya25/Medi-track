import { RouteObject } from "react-router-dom";

export const doctorRoutes: RouteObject[] = [
  {
    path: "/doctor",
    element: null, // DoctorLayout (Phase 2)
    children: [
      { index: true, element: null },
      { path: "appointments/today", element: null },
      { path: "patients/:patientId", element: null },
      { path: "prescriptions", element: null },
      { path: "availability", element: null },
      { path: "leaves", element: null },
      { path: "earnings", element: null },
    ],
  },
];
