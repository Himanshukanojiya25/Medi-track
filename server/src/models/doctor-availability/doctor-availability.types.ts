import { Types } from "mongoose";

export interface TimeSlot {
  start: string; // "10:00"
  end: string;   // "13:00"
}

export interface WeeklyAvailability {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  slots: TimeSlot[];
}

export interface DoctorAvailability {
  _id: Types.ObjectId;
  doctorId: Types.ObjectId;
  slotDurationMinutes: number; // e.g. 15, 20, 30
  weeklyAvailability: WeeklyAvailability[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
