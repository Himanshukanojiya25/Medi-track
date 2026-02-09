// src/app/routing/index.ts

import { RouteObject } from "react-router-dom";

import { publicAppRoutes } from "./public.routes";
import { patientRoutes } from "./patient.routes";
import { doctorRoutes } from "./doctor.routes";
import { hospitalAdminRoutes } from "./hospital-admin.routes";
import { billingRoutes } from "./billing.routes";
import { aiRoutes } from "./ai.routes";
import { superAdminRoutes } from "./super-admin.routes";

export const appRoutes: RouteObject[] = [
  ...publicAppRoutes,
  ...patientRoutes,
  ...doctorRoutes,
  ...hospitalAdminRoutes,
  ...billingRoutes,
  ...aiRoutes,
  ...superAdminRoutes,
];
