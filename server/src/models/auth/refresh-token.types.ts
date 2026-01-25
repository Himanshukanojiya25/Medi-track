import { Types } from "mongoose";

export type RefreshTokenStatus = "ACTIVE" | "REVOKED";

export interface RefreshTokenDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  status: RefreshTokenStatus;
  expiresAt: Date;

  // ✅ ADD THIS
  revokedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
