import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_NOTICES } from "@/mocks/fixtures/notice-board";
import type { Notice } from "@/features/notice-board/types";

const baseUrl = siteConfig.api.baseUrl;

let notices: Notice[] = [...MOCK_NOTICES];
let nextId = notices.length + 1;

function sortNotices(list: Notice[]): Notice[] {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.postedAt.localeCompare(a.postedAt);
  });
}

export const noticeBoardHandlers = [
  http.get(`${baseUrl}/notice-board`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = notices;
    if (search) {
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(search) || n.body.toLowerCase().includes(search),
      );
    }
    filtered = sortNotices(filtered);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/notice-board/:id`, ({ params }) => {
    const notice = notices.find((n) => n.id === params.id);
    if (!notice) return HttpResponse.json({ message: "Announcement not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: notice });
  }),

  http.post(`${baseUrl}/notice-board`, async ({ request }) => {
    const body = (await request.json()) as Partial<Notice>;
    if (!body.title || !body.body) {
      return HttpResponse.json(
        { message: "Title and body are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const notice: Notice = {
      id: `notice_${nextId++}`,
      title: body.title,
      body: body.body,
      audience: body.audience ?? "all",
      pinned: false,
      postedAt: new Date().toISOString(),
    };
    notices = [notice, ...notices];
    return HttpResponse.json({ data: notice }, { status: 201 });
  }),

  http.patch(`${baseUrl}/notice-board/:id`, async ({ params, request }) => {
    const index = notices.findIndex((n) => n.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Announcement not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<Notice>;
    const updated: Notice = { ...notices[index]!, ...body };
    notices = notices.map((n) => (n.id === params.id ? updated : n));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/notice-board/:id`, ({ params }) => {
    const exists = notices.some((n) => n.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Announcement not found.", code: "NOT_FOUND" }, { status: 404 });
    notices = notices.filter((n) => n.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
