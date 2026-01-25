import { Document, Types } from 'mongoose';
import { ROLES } from '../../constants/roles';
import { HOSPITAL_ADMIN_STATUS } from '../../constants/status';

export interface HospitalAdmin extends Document {
  hospitalId: Types.ObjectId;

  name: string;
  email: string;
  passwordHash: string;

  role: typeof ROLES.HOSPITAL_ADMIN;

  status: (typeof HOSPITAL_ADMIN_STATUS)[keyof typeof HOSPITAL_ADMIN_STATUS];

  isActive: boolean;

  lastLoginAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
