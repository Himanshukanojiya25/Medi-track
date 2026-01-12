import { Router } from "express";
import NotificationController from "../../controllers/notification/notification.controller";
import { devAuth } from "../../middlewares";

const router = Router();

/**
 * Notification Routes
 * -------------------
 * Mounted at /api/v1/notifications
 */

// GET /api/v1/notifications
router.get("/", devAuth, NotificationController.getInbox);

// GET /api/v1/notifications/unread-count
router.get(
  "/unread-count",
  devAuth,
  NotificationController.getUnreadCount
);

// PATCH /api/v1/notifications/read-all
router.patch(
  "/read-all",
  devAuth,
  NotificationController.markAllAsRead
);

// PATCH /api/v1/notifications/:id/read
router.patch(
  "/:id/read",
  devAuth,
  NotificationController.markAsRead
);

export default router;
