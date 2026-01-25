// client/src/routes/auth/auth.routes.tsx

import { RouteObject } from "react-router-dom";
import { LoginPage } from "../../pages/auth";

/**
 * Auth Routes
 * (Public – no auth required)
 */
export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
];
