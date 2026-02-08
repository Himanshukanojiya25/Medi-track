import type { ID, ISODateString } from "../shared";

/**
 * Notification delivery channel
 * (future-proof)
 */
export enum NotificationChannel {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
}

/**
 * Notification lifecycle status
 */
export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}

/**
 * Core notification entity
 */
export interface Notification {
  readonly id: ID;

  readonly userId: ID;
  readonly title: string;
  readonly message: string;

  readonly channel: NotificationChannel;
  readonly status: NotificationStatus;

  readonly metadata?: Record<string, unknown>;
  readonly createdAt: ISODateString;
  readonly readAt?: ISODateString;
}
