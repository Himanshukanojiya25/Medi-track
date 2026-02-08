import { ROLES, AppRole } from "../constants";

export const ROLE_REGISTRY: Record<AppRole, {
  label: string;
  dashboardRoute: string;
}> = {
  public: {
    label: "Public",
    dashboardRoute: "/",
  },
  patient: {
    label: "Patient",
    dashboardRoute: "/patient/dashboard",
  },
  doctor: {
    label: "Doctor",
    dashboardRoute: "/doctor/dashboard",
  },
  hospital_admin: {
    label: "Hospital Admin",
    dashboardRoute: "/hospital-admin/dashboard",
  },
  super_admin: {
    label: "Super Admin",
    dashboardRoute: "/super-admin/dashboard",
  },
};
