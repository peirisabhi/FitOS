import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_SESSIONS } from "@/mocks/fixtures/sessions";
import type { GymSession } from "@/features/sessions/types";

const baseUrl = siteConfig.api.baseUrl;

let sessions: GymSession[] = [...MOCK_SESSIONS];
let nextId = sessions.length + 1;

export const sessionsHandlers = [
  http.get(`${baseUrl}/sessions`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = sessions;
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(search) ||
          s.trainerName.toLowerCase().includes(search) ||
          (s.memberName?.toLowerCase().includes(search) ?? false),
      );
    }
    filtered = [...filtered].sort((a, b) => a.start.localeCompare(b.start));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/sessions/:id`, ({ params }) => {
    const session = sessions.find((s) => s.id === params.id);
    if (!session) return HttpResponse.json({ message: "Session not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: session });
  }),

  http.post(`${baseUrl}/sessions`, async ({ request }) => {
    const body = (await request.json()) as Partial<GymSession>;
    if (!body.title || !body.start || !body.end) {
      return HttpResponse.json(
        { message: "Title, start, and end are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const session: GymSession = {
      id: `sess_${nextId++}`,
      title: body.title,
      type: body.type ?? "class",
      trainerName: body.trainerName ?? "",
      memberName: body.memberName,
      start: body.start,
      end: body.end,
      location: body.location ?? "",
      status: "scheduled",
    };
    sessions = [session, ...sessions];
    return HttpResponse.json({ data: session }, { status: 201 });
  }),

  http.patch(`${baseUrl}/sessions/:id`, async ({ params, request }) => {
    const index = sessions.findIndex((s) => s.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Session not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<GymSession>;
    const updated: GymSession = { ...sessions[index]!, ...body };
    sessions = sessions.map((s) => (s.id === params.id ? updated : s));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/sessions/:id`, ({ params }) => {
    const exists = sessions.some((s) => s.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Session not found.", code: "NOT_FOUND" }, { status: 404 });
    sessions = sessions.filter((s) => s.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
