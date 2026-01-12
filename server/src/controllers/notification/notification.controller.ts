import { Request, Response, NextFunction } from "express";
import NotificationService from "../../services/notification/notification.service";

/**
 * Notification Controller
 * -----------------------
 * Thin HTTP layer.
 */
export default class NotificationController {
  static async getInbox(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientId = req.user!.id;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const data = await NotificationService.getInbox({
        recipientId,
        page,
        limit,
      });

      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = req.params.id;
      const recipientId = req.user!.id;

      const updated = await NotificationService.markAsRead(
        notificationId,
        recipientId
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientId = req.user!.id;

      await NotificationService.markAllAsRead(recipientId);

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientId = req.user!.id;

      const unreadCount =
        await NotificationService.getUnreadCount(recipientId);

      res.status(200).json({
        success: true,
        data: { unreadCount },
      });
    } catch (error) {
      next(error);
    }
  }
}



