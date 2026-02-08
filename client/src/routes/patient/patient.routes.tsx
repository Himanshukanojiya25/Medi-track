// src/routes/patient/patient.routes.ts
import { RouteObject } from 'react-router-dom';
import { PatientLayout } from '../../layouts/patient/PatientLayout';

export const PatientRoutes: RouteObject[] = [
  {
    path: '/patient',
    element: <PatientLayout />,
    children: [
      { index: true, element: <div>Patient Dashboard</div> },
      { path: 'appointments', element: <div>Appointments</div> },
      { path: 'profile', element: <div>Profile</div> },
    ],
  },
];
