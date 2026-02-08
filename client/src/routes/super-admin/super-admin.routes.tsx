// src/routes/super-admin/super-admin.routes.ts
import { RouteObject } from 'react-router-dom';
import { SuperAdminLayout } from '../../layouts/super-admin/SuperAdminLayout';

export const SuperAdminRoutes: RouteObject[] = [
  {
    path: '/super-admin',
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <div>Super Admin Dashboard</div> },
      { path: 'hospitals', element: <div>Hospitals</div> },
      { path: 'analytics', element: <div>Analytics</div> },
    ],
  },
];
