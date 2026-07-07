import { notificationRepository } from "@/features/notifications/repository";

export const notificationService = {
  list: notificationRepository.list,
  update: notificationRepository.update,
  remove: notificationRepository.remove,
  markAllAsRead: notificationRepository.markAllAsRead,
};
