// src/routes/doctor/doctor.routes.ts
import { RouteObject } from 'react-router-dom';
import { DoctorLayout } from '../../layouts/doctor/DoctorLayout';

export const DoctorRoutes: RouteObject[] = [
  {
    path: '/doctor',
    element: <DoctorLayout />,
    children: [
      { index: true, element: <div>Doctor Dashboard</div> },
      { path: 'appointments', element: <div>Today Appointments</div> },
      { path: 'availability', element: <div>Availability</div> },
    ],
  },
];
