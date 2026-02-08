import { AppRole } from "../constants";

export type Permission =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "suspend";

export const PERMISSION_REGISTRY: Record<AppRole, Permission[]> = {
  public: ["view"],
  patient: ["view", "create"],
  doctor: ["view", "create", "update"],
  hospital_admin: ["view", "create", "update", "approve"],
  super_admin: ["view", "create", "update", "delete", "approve", "suspend"],
};
