import { Types } from 'mongoose';
import { AppointmentStatus } from '../../constants/status';

export interface IAppointment {
  _id: Types.ObjectId;

  hospitalId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;

  scheduledAt: Date;
  durationMinutes: number;

  reason?: string;
  notes?: string;

  status: AppointmentStatus;

  createdByHospitalAdminId?: Types.ObjectId;

  /**
   * =========================
   * CANCELLATION METADATA
   * =========================
   */
  cancelledReason?: string | null;
  cancelledAt?: Date | null;
  cancelledBy?: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}
