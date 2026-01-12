import { Types } from 'mongoose';
import { PrescriptionStatus } from '../../constants/status';

export interface IPrescriptionMedicine {
  name: string;
  dosage: string;        // e.g. "500mg"
  frequency: string;     // e.g. "2 times a day"
  durationDays: number;  // e.g. 5
  instructions?: string;
}

export interface IPrescription {
  _id: Types.ObjectId;

  hospitalId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;

  medicines: IPrescriptionMedicine[];

  notes?: string;

  status: PrescriptionStatus;

  createdAt: Date;
  updatedAt: Date;
}
