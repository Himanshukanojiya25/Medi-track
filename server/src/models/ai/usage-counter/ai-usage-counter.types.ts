import { Types } from "mongoose";

export interface AIUsageCounter {
  _id: Types.ObjectId;

  userId: Types.ObjectId;
  hospitalId?: Types.ObjectId;

  role: "patient" | "doctor" | "hospital-admin" | "super-admin";

  date: string; // YYYY-MM-DD

  totalRequests: number;
  totalTokensUsed: number;

  createdAt: Date;
  updatedAt: Date;
}
