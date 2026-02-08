// src/routes/hospital-admin/hospital-admin.routes.ts
import { RouteObject } from 'react-router-dom';
import { HospitalAdminLayout } from '../../layouts/hospital-admin/HospitalAdminLayout';

export const HospitalAdminRoutes: RouteObject[] = [
  {
    path: '/hospital-admin',
    element: <HospitalAdminLayout />,
    children: [
      { index: true, element: <div>Hospital Admin Dashboard</div> },
      { path: 'doctors', element: <div>Doctors Management</div> },
      { path: 'billing', element: <div>Billing</div> },
    ],
  },
];
