import { Types } from "mongoose";

export interface DoctorLeave {
  hospitalId: Types.ObjectId;
  doctorId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason?: string;
  createdAt: Date;
}
