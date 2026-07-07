import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_MEMBERSHIP_PLANS } from "@/mocks/fixtures/memberships";
import type { MembershipPlan } from "@/features/memberships/types";

const baseUrl = siteConfig.api.baseUrl;

let plans: MembershipPlan[] = [...MOCK_MEMBERSHIP_PLANS];
let nextId = plans.length + 1;

export const membershipsHandlers = [
  http.get(`${baseUrl}/memberships`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = plans;
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/memberships/:id`, ({ params }) => {
    const plan = plans.find((p) => p.id === params.id);
    if (!plan) return HttpResponse.json({ message: "Plan not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: plan });
  }),

  http.post(`${baseUrl}/memberships`, async ({ request }) => {
    const body = (await request.json()) as Partial<MembershipPlan>;
    if (!body.name || body.price === undefined) {
      return HttpResponse.json(
        { message: "Name and price are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const plan: MembershipPlan = {
      id: `plan_${nextId++}`,
      name: body.name,
      description: body.description,
      price: body.price,
      billingCycle: body.billingCycle ?? "monthly",
      durationDays: body.durationDays ?? 30,
      status: "active",
      activeSubscribers: 0,
    };
    plans = [plan, ...plans];
    return HttpResponse.json({ data: plan }, { status: 201 });
  }),

  http.patch(`${baseUrl}/memberships/:id`, async ({ params, request }) => {
    const index = plans.findIndex((p) => p.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Plan not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<MembershipPlan>;
    const updated: MembershipPlan = { ...plans[index]!, ...body };
    plans = plans.map((p) => (p.id === params.id ? updated : p));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/memberships/:id`, ({ params }) => {
    const exists = plans.some((p) => p.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Plan not found.", code: "NOT_FOUND" }, { status: 404 });
    plans = plans.filter((p) => p.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
