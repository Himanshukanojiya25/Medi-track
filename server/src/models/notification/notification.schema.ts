import { Schema } from "mongoose";
import { Notification } from "./notification.types";

export const NotificationSchema = new Schema<Notification>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
    },

    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      required: true,
      enum: [
        "super_admin",
        "hospital_admin",
        "doctor",
        "patient",
        "system",
      ],
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "appointment",
        "doctor",
        "billing",
        "system",
        "review",
        "leave",
      ],
      index: true,
    },

    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
      index: true,
    },

    actionUrl: {
      type: String,
      trim: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

/**
 * =========================
 * INDEXES (PRODUCTION)
 * =========================
 */

// Inbox listing (fast)
NotificationSchema.index({
  recipientId: 1,
  status: 1,
  createdAt: -1,
});

// Hospital-wide notifications (admin dashboards)
NotificationSchema.index({
  hospitalId: 1,
  createdAt: -1,
});

// Type-based filtering
NotificationSchema.index({
  type: 1,
  createdAt: -1,
});
