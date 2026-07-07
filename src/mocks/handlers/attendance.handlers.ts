import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_ATTENDANCE } from "@/mocks/fixtures/attendance";
import type { AttendanceRecord } from "@/features/attendance/types";

const baseUrl = siteConfig.api.baseUrl;

let records: AttendanceRecord[] = [...MOCK_ATTENDANCE];
let nextId = records.length + 1;

export const attendanceHandlers = [
  http.get(`${baseUrl}/attendance`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = records;
    if (search) {
      filtered = filtered.filter((r) => r.memberName.toLowerCase().includes(search));
    }
    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }
    filtered = [...filtered].sort((a, b) => b.checkInAt.localeCompare(a.checkInAt));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/attendance/:id`, ({ params }) => {
    const record = records.find((r) => r.id === params.id);
    if (!record) return HttpResponse.json({ message: "Record not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: record });
  }),

  http.post(`${baseUrl}/attendance`, async ({ request }) => {
    const body = (await request.json()) as Partial<AttendanceRecord>;
    if (!body.memberName) {
      return HttpResponse.json({ message: "Member name is required.", code: "VALIDATION_ERROR" }, { status: 400 });
    }
    const record: AttendanceRecord = {
      id: `att_${nextId++}`,
      memberName: body.memberName,
      checkInAt: new Date().toISOString(),
      method: body.method ?? "manual",
      status: "checked-in",
    };
    records = [record, ...records];
    return HttpResponse.json({ data: record }, { status: 201 });
  }),

  http.patch(`${baseUrl}/attendance/:id`, async ({ params, request }) => {
    const index = records.findIndex((r) => r.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Record not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<AttendanceRecord>;
    const updated: AttendanceRecord = { ...records[index]!, ...body };
    records = records.map((r) => (r.id === params.id ? updated : r));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/attendance/:id`, ({ params }) => {
    const exists = records.some((r) => r.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Record not found.", code: "NOT_FOUND" }, { status: 404 });
    records = records.filter((r) => r.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
