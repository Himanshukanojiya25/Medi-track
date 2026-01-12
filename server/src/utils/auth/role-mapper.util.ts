/**
 * Converts AUTH role → DB/AUDIT role
 * SUPER_ADMIN → super_admin
 */
export const toDbRole = (role: string) => {
  return role.toLowerCase() as
    | "super_admin"
    | "hospital_admin"
    | "doctor"
    | "patient"
    | "system";
};
