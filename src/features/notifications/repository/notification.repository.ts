import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { Notification, UpdateNotificationDTO, INotificationRepository } from "@/features/notifications/types";

export const notificationRepository: INotificationRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<Notification>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<Notification>>>(
      `/notifications${buildQueryString(params)}`,
    );
    return res.data;
  },
  async update(id: string, dto: UpdateNotificationDTO): Promise<Notification> {
    const res = await httpClient.patch<ApiResponse<Notification>>(`/notifications/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/notifications/${id}`);
  },
  async markAllAsRead(): Promise<void> {
    await httpClient.post<void>("/notifications/mark-all-read");
  },
};
