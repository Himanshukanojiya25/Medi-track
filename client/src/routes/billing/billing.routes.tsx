// src/routes/billing/billing.routes.ts
import { RouteObject } from 'react-router-dom';
import { BillingLayout } from '../../layouts/billing/BillingLayout';

export const BillingRoutes: RouteObject[] = [
  {
    path: '/billing',
    element: <BillingLayout />,
    children: [
      { index: true, element: <div>Billing Overview</div> },
      { path: 'invoices', element: <div>Invoices</div> },
    ],
  },
];
