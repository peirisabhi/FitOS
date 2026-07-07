import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_PAYMENTS } from "@/mocks/fixtures/payments";
import type { Payment } from "@/features/payments/types";

const baseUrl = siteConfig.api.baseUrl;

let payments: Payment[] = [...MOCK_PAYMENTS];
let nextId = payments.length + 1;

export const paymentsHandlers = [
  http.get(`${baseUrl}/payments`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = payments;
    if (search) {
      filtered = filtered.filter(
        (p) => p.memberName.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
      );
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    filtered = [...filtered].sort((a, b) => b.dueOn.localeCompare(a.dueOn));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/payments/:id`, ({ params }) => {
    const payment = payments.find((p) => p.id === params.id);
    if (!payment) return HttpResponse.json({ message: "Payment not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: payment });
  }),

  http.post(`${baseUrl}/payments`, async ({ request }) => {
    const body = (await request.json()) as Partial<Payment>;
    if (!body.memberName || body.amount === undefined) {
      return HttpResponse.json(
        { message: "Member and amount are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const payment: Payment = {
      id: `pay_${nextId++}`,
      memberName: body.memberName,
      description: body.description ?? "Payment",
      amount: body.amount,
      method: body.method ?? "card",
      status: "pending",
      dueOn: body.dueOn ?? new Date().toISOString(),
    };
    payments = [payment, ...payments];
    return HttpResponse.json({ data: payment }, { status: 201 });
  }),

  http.patch(`${baseUrl}/payments/:id`, async ({ params, request }) => {
    const index = payments.findIndex((p) => p.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Payment not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<Payment>;
    const updated: Payment = { ...payments[index]!, ...body };
    payments = payments.map((p) => (p.id === params.id ? updated : p));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/payments/:id`, ({ params }) => {
    const exists = payments.some((p) => p.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Payment not found.", code: "NOT_FOUND" }, { status: 404 });
    payments = payments.filter((p) => p.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
