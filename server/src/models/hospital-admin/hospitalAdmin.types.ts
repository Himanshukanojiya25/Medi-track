import { BaseDocument } from "../../types/db";
import { HOSPITAL_ADMIN_STATUS } from "../../constants/status";
import { SYSTEM_ROLES } from "../../constants/roles";
import { Types } from "mongoose";

export interface HospitalAdmin extends BaseDocument {
  hospitalId: Types.ObjectId;

  name: string;
  email: string;
  passwordHash: string;

  role: SYSTEM_ROLES.HOSPITAL_ADMIN;
  status: HOSPITAL_ADMIN_STATUS;

  isActive: boolean;
  lastLoginAt?: Date;
}
