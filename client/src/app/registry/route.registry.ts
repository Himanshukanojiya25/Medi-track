import { AppRole } from "../constants";

export type RouteAccess = {
  path: string;
  roles: AppRole[];
  protected: boolean;
};

export const ROUTE_REGISTRY: RouteAccess[] = [
  {
    path: "/",
    roles: ["public"],
    protected: false,
  },
  {
    path: "/patient",
    roles: ["patient"],
    protected: true,
  },
  {
    path: "/doctor",
    roles: ["doctor"],
    protected: true,
  },
  {
    path: "/hospital-admin",
    roles: ["hospital_admin"],
    protected: true,
  },
  {
    path: "/super-admin",
    roles: ["super_admin"],
    protected: true,
  },
];
