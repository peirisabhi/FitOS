import type { ICrudRepository } from "@/repositories/base.repository";

export const NOTIFICATION_CATEGORIES = ["system", "billing", "membership", "session"] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  createdAt: string;
  read: boolean;
}

export type UpdateNotificationDTO = { read: boolean };

export interface INotificationRepository
  extends Pick<ICrudRepository<Notification, never, UpdateNotificationDTO>, "list" | "update" | "remove"> {
  markAllAsRead(): Promise<void>;
}
