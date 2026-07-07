import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_NOTIFICATIONS } from "@/mocks/fixtures/notifications";
import type { Notification } from "@/features/notifications/types";

const baseUrl = siteConfig.api.baseUrl;

let notifications: Notification[] = [...MOCK_NOTIFICATIONS];

export const notificationsHandlers = [
  http.get(`${baseUrl}/notifications`, ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("read");
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = notifications;
    if (filter !== null) {
      filtered = filtered.filter((n) => String(n.read) === filter);
    }
    filtered = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.patch(`${baseUrl}/notifications/:id`, async ({ params, request }) => {
    const index = notifications.findIndex((n) => n.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: "Notification not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    const body = (await request.json()) as Partial<Notification>;
    const updated: Notification = { ...notifications[index]!, ...body };
    notifications = notifications.map((n) => (n.id === params.id ? updated : n));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/notifications/:id`, ({ params }) => {
    const exists = notifications.some((n) => n.id === params.id);
    if (!exists) {
      return HttpResponse.json({ message: "Notification not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    notifications = notifications.filter((n) => n.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${baseUrl}/notifications/mark-all-read`, () => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return new HttpResponse(null, { status: 204 });
  }),
];
