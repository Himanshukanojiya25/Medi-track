import { RouteObject } from "react-router-dom";

export const billingRoutes: RouteObject[] = [
  {
    path: "/billing",
    element: null, // BillingLayout
    children: [
      { index: true, element: null }, // Bills list
      { path: ":billId", element: null },
      { path: "invoices/:invoiceId", element: null },
    ],
  },
];
