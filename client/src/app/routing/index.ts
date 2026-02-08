import { RouteObject } from "react-router-dom";

import { publicRoutes } from "./public.routes";
import { patientRoutes } from "./patient.routes";
import { doctorRoutes } from "./doctor.routes";
import { hospitalAdminRoutes } from "./hospital-admin.routes";
import { billingRoutes } from "./billing.routes";
import { aiRoutes } from "./ai.routes";
import { superAdminRoutes } from "./super-admin.routes";

/**
 * App Routes
 * -----------------------
 * Single source of truth for routing tree.
 */
export const appRoutes: RouteObject[] = [
  ...publicRoutes,
  ...patientRoutes,
  ...doctorRoutes,
  ...hospitalAdminRoutes,
  ...billingRoutes,
  ...aiRoutes,
  ...superAdminRoutes,
];
