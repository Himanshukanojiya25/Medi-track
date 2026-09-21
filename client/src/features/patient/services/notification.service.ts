// client/src/features/patient/services/notification.service.ts

import { httpClient } from '../../../services/api/http.client';
import type { ID, ISODateString } from '../../../types/shared';

// ============================================================================
// ENUMS
// ============================================================================

export enum NotificationCategory {
  APPOINTMENT = 'APPOINTMENT',
  PRESCRIPTION = 'PRESCRIPTION',
  BILLING      = 'BILLING',
  MEDICAL      = 'MEDICAL',
  SYSTEM       = 'SYSTEM',
  PROMOTION    = 'PROMOTION',
  REMINDER     = 'REMINDER',
  ALERT        = 'ALERT',
}

export enum NotificationPriority {
  LOW    = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH   = 'HIGH',
  URGENT = 'URGENT',
}

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  readonly id: ID;
  readonly patientId: ID;
  readonly title: string;
  readonly message: string;
  readonly category: NotificationCategory;
  readonly priority: NotificationPriority;
  readonly isRead: boolean;
  readonly readAt?: ISODateString;
  readonly actionUrl?: string;
  readonly actionLabel?: string;
  readonly metadata?: Record<string, unknown>;
  readonly icon?: string;
  readonly imageUrl?: string;
  readonly expiresAt?: ISODateString;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface NotificationListParams {
  category?: NotificationCategory;
  isRead?: boolean;
  priority?: NotificationPriority;
  page?: number;
  limit?: number;
}

export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: { count: number };
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
  message?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

const API_BASE = '/api/v1/notifications';

export const notificationService = {

  /**
   * Get notification inbox (paginated, filterable)
   * GET /api/v1/notifications
   */
  getInbox: async (params?: NotificationListParams): Promise<NotificationListResponse> => {
    const response = await httpClient.get<NotificationListResponse>(API_BASE, { params });
    return response.data;
  },

  /**
   * Get unread notification count
   * GET /api/v1/notifications/unread-count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await httpClient.get<UnreadCountResponse>(
      `${API_BASE}/unread-count`,
    );
    return response.data.data.count;
  },

  /**
   * Mark a single notification as read
   * PATCH /api/v1/notifications/:id/read
   */
  markAsRead: async (id: ID): Promise<Notification> => {
    const response = await httpClient.patch<NotificationResponse>(
      `${API_BASE}/${id}/read`,
    );
    return response.data.data;
  },

  /**
   * Mark all notifications as read
   * PATCH /api/v1/notifications/read-all
   */
  markAllAsRead: async (): Promise<void> => {
    await httpClient.patch(`${API_BASE}/read-all`);
  },

  /**
   * Delete a notification
   * DELETE /api/v1/notifications/:id
   */
  delete: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/${id}`);
  },

  /**
   * Delete all read notifications
   * DELETE /api/v1/notifications/read
   */
  deleteAllRead: async (): Promise<void> => {
    await httpClient.delete(`${API_BASE}/read`);
  },

} as const;

export default notificationService;