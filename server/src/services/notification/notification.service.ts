import { Types } from "mongoose";
import { NotificationModel } from "../../models/notification";

/**
 * Notification Service
 * --------------------
 * Pure business logic layer.
 */
export default class NotificationService {
  /**
   * Create notification
   */
  static async create(payload: {
    hospitalId?: string;
    recipientId: string;
    recipientRole: "patient" | "doctor" | "hospital_admin" | "super_admin";
    title: string;
    message: string;
    type: string;
    metadata?: Record<string, unknown>;
  }) {
    if (!Types.ObjectId.isValid(payload.recipientId)) {
      throw new Error("Invalid recipient ID");
    }

    if (payload.hospitalId && !Types.ObjectId.isValid(payload.hospitalId)) {
      throw new Error("Invalid hospital ID");
    }

    return NotificationModel.create({
      hospitalId: payload.hospitalId,
      recipientId: payload.recipientId,
      recipientRole: payload.recipientRole,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      status: "unread",
      metadata: payload.metadata ?? {},
    });
  }

  /**
   * Get inbox (unread first, latest first)
   */
  static async getInbox(params: {
    recipientId: string;
    page?: number;
    limit?: number;
  }) {
    if (!Types.ObjectId.isValid(params.recipientId)) {
      throw new Error("Invalid recipient ID");
    }

    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const query = { recipientId: params.recipientId };

    const [items, total] = await Promise.all([
      NotificationModel.find(query)
        .sort({ status: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      NotificationModel.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(notificationId: string, recipientId: string) {
    if (
      !Types.ObjectId.isValid(notificationId) ||
      !Types.ObjectId.isValid(recipientId)
    ) {
      throw new Error("Invalid ID");
    }

    return NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        recipientId,
        status: "unread",
      },
      {
        status: "read",
        readAt: new Date(),
      },
      { new: true }
    ).exec();
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(recipientId: string) {
    if (!Types.ObjectId.isValid(recipientId)) {
      throw new Error("Invalid recipient ID");
    }

    return NotificationModel.updateMany(
      {
        recipientId,
        status: "unread",
      },
      {
        $set: {
          status: "read",
          readAt: new Date(),
        },
      }
    ).exec();
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(recipientId: string) {
    if (!Types.ObjectId.isValid(recipientId)) {
      throw new Error("Invalid recipient ID");
    }

    return NotificationModel.countDocuments({
      recipientId,
      status: "unread",
    }).exec();
  }
}
