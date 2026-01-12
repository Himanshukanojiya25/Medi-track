import { Types } from 'mongoose';
import { PatientStatus } from '../../constants/status';

export interface IPatient {
  _id: Types.ObjectId;

  hospitalId: Types.ObjectId;
  createdByHospitalAdminId: Types.ObjectId;

  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  phone: string;

  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';

  bloodGroup?: string;

  status: PatientStatus;

  emergencyContact?: {
    name: string;
    phone: string;
    relation?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
