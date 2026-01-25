import { ROLES } from '../../constants/roles';
import { Document } from 'mongoose';

export interface SuperAdmin extends Document {
  email: string;
  passwordHash: string;
  role: typeof ROLES.SUPER_ADMIN;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
