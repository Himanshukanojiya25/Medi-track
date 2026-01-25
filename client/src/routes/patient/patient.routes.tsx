// client/src/routes/patient/patient.routes.tsx

import { RouteObject } from "react-router-dom";
import {
  PatientHomePage,
  DoctorsListPage,
  HospitalsListPage,
} from "../../pages/patient";

/**
 * Patient Public Routes
 * (No authentication required)
 */
export const patientPublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PatientHomePage />,
  },
  {
    path: "/doctors",
    element: <DoctorsListPage />,
  },
  {
    path: "/hospitals",
    element: <HospitalsListPage />,
  },
];
