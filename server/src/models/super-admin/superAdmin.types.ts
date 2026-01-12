import { BaseDocument } from "../../types/db";
import { SYSTEM_ROLES } from "../../constants/roles";

export interface SuperAdmin extends BaseDocument {
  email: string;
  passwordHash: string;
  role: SYSTEM_ROLES.SUPER_ADMIN;
  isActive: boolean;
  lastLoginAt?: Date;
}
