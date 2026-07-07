import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_MEMBERS } from "@/mocks/fixtures/members";
import type { Member } from "@/features/members/types";

const baseUrl = siteConfig.api.baseUrl;

/** Mutable in-memory copy — mocks/fixtures stays the pure seed, this is the "database" for the session. */
let members: Member[] = [...MOCK_MEMBERS];
let nextId = members.length + 1;

function sortMembers(list: Member[], sortBy?: string | null, sortDir?: string | null): Member[] {
  if (!sortBy) return list;
  const dir = sortDir === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    const av = String(a[sortBy as keyof Member] ?? "");
    const bv = String(b[sortBy as keyof Member] ?? "");
    return av.localeCompare(bv) * dir;
  });
}

export const membersHandlers = [
  http.get(`${baseUrl}/members`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);
    const sortBy = url.searchParams.get("sortBy");
    const sortDir = url.searchParams.get("sortDir");

    let filtered = members;
    if (search) {
      filtered = filtered.filter(
        (m) => m.name.toLowerCase().includes(search) || m.email.toLowerCase().includes(search),
      );
    }
    filtered = sortMembers(filtered, sortBy, sortDir);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/members/:id`, ({ params }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) {
      return HttpResponse.json({ message: "Member not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    return HttpResponse.json({ data: member });
  }),

  http.post(`${baseUrl}/members`, async ({ request }) => {
    const body = (await request.json()) as Partial<Member>;
    if (!body.name || !body.email) {
      return HttpResponse.json(
        { message: "Name and email are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const member: Member = {
      id: `mem_${nextId++}`,
      name: body.name,
      email: body.email,
      phone: body.phone ?? "",
      planName: body.planName ?? "Monthly Basic",
      status: "active",
      joinedOn: new Date().toISOString(),
      trainerName: body.trainerName,
    };
    members = [member, ...members];
    return HttpResponse.json({ data: member }, { status: 201 });
  }),

  http.patch(`${baseUrl}/members/:id`, async ({ params, request }) => {
    const index = members.findIndex((m) => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: "Member not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    const body = (await request.json()) as Partial<Member>;
    const existing = members[index]!;
    const updated: Member = { ...existing, ...body };
    members = members.map((m) => (m.id === params.id ? updated : m));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/members/:id`, ({ params }) => {
    const exists = members.some((m) => m.id === params.id);
    if (!exists) {
      return HttpResponse.json({ message: "Member not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    members = members.filter((m) => m.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
