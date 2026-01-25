import { BaseDocument } from '../../types/db';
import { DOCTOR_STATUS } from '../../constants/status';
import { ROLES } from '../../constants/roles';
import { Types } from 'mongoose';

/**
 * Doctor Entity Type
 * ------------------
 * This must EXACTLY match DoctorSchema
 */
export interface Doctor extends BaseDocument {
  // 🔗 Relations
  hospitalId: Types.ObjectId;
  hospitalAdminId: Types.ObjectId;

  // 👤 Identity
  name: string;
  email: string;

  /**
   * 🔐 Password hash
   * Required for doctor login
   * (select:false in schema, but type must exist)
   */
  passwordHash: string;

  // 📞 Optional info
  phone?: string;
  specialization: string;

  // 🧑‍⚕️ Role & status
  role: typeof ROLES.DOCTOR;
  status: DOCTOR_STATUS;

  // ⚙️ Meta
  isActive: boolean;
  lastLoginAt?: Date;
}
