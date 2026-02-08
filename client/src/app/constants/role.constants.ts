export const ROLES = {
  PUBLIC: "public",
  PATIENT: "patient",
  DOCTOR: "doctor",
  HOSPITAL_ADMIN: "hospital_admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  public: 0,
  patient: 1,
  doctor: 2,
  hospital_admin: 3,
  super_admin: 4,
};
