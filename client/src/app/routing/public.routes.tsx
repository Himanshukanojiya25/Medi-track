// src/app/routing/public.routes.tsx

import { RouteObject } from "react-router-dom";
import { PublicLayout } from "../../layouts/public";
import { publicRoutes as publicFeatureRoutes } from "../../features/public/routes";

export const publicAppRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: publicFeatureRoutes,
  },
];
