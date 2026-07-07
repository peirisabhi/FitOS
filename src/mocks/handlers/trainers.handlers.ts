import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_TRAINERS } from "@/mocks/fixtures/trainers";
import type { Trainer } from "@/features/trainers/types";

const baseUrl = siteConfig.api.baseUrl;

let trainers: Trainer[] = [...MOCK_TRAINERS];
let nextId = trainers.length + 1;

export const trainersHandlers = [
  http.get(`${baseUrl}/trainers`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = trainers;
    if (search) {
      filtered = filtered.filter(
        (t) => t.name.toLowerCase().includes(search) || t.specialty.toLowerCase().includes(search),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/trainers/:id`, ({ params }) => {
    const trainer = trainers.find((t) => t.id === params.id);
    if (!trainer) {
      return HttpResponse.json({ message: "Trainer not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    return HttpResponse.json({ data: trainer });
  }),

  http.post(`${baseUrl}/trainers`, async ({ request }) => {
    const body = (await request.json()) as Partial<Trainer>;
    if (!body.name || !body.email) {
      return HttpResponse.json(
        { message: "Name and email are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const trainer: Trainer = {
      id: `trn_${nextId++}`,
      name: body.name,
      email: body.email,
      phone: body.phone ?? "",
      specialty: body.specialty ?? "Strength Training",
      status: "active",
      rating: 0,
      activeClients: 0,
      joinedOn: new Date().toISOString(),
    };
    trainers = [trainer, ...trainers];
    return HttpResponse.json({ data: trainer }, { status: 201 });
  }),

  http.patch(`${baseUrl}/trainers/:id`, async ({ params, request }) => {
    const index = trainers.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: "Trainer not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    const body = (await request.json()) as Partial<Trainer>;
    const updated: Trainer = { ...trainers[index]!, ...body };
    trainers = trainers.map((t) => (t.id === params.id ? updated : t));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/trainers/:id`, ({ params }) => {
    const exists = trainers.some((t) => t.id === params.id);
    if (!exists) {
      return HttpResponse.json({ message: "Trainer not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    trainers = trainers.filter((t) => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
