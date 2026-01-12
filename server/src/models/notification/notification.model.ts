import { model } from "mongoose";
import { Notification } from "./notification.types";
import { NotificationSchema } from "./notification.schema";

export const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
);
