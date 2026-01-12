import { Types } from "mongoose";

export type NotificationAudience =
  | "super_admin"
  | "hospital_admin"
  | "doctor"
  | "patient"
  | "system";

export type NotificationStatus = "unread" | "read";

export interface Notification {
  _id?: Types.ObjectId;

  // Ownership / audience
  hospitalId?: Types.ObjectId; // optional (system/global notifications)
  recipientId: Types.ObjectId;
  recipientRole: NotificationAudience;

  // Content
  title: string;
  message: string;

  // Semantic classification
  type:
    | "appointment"
    | "doctor"
    | "billing"
    | "system"
    | "review"
    | "leave";

  // UX helpers
  status: NotificationStatus;
  actionUrl?: string; // deep-link (frontend)
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt?: Date;
  readAt?: Date;
}
