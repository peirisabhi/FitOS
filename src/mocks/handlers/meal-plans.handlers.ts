import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_MEAL_PLANS } from "@/mocks/fixtures/meal-plans";
import type { MealPlan } from "@/features/meal-plans/types";

const baseUrl = siteConfig.api.baseUrl;

let mealPlans: MealPlan[] = [...MOCK_MEAL_PLANS];
let nextId = mealPlans.length + 1;

export const mealPlansHandlers = [
  http.get(`${baseUrl}/meal-plans`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = mealPlans;
    if (search) {
      filtered = filtered.filter(
        (p) => p.memberName.toLowerCase().includes(search) || p.planName.toLowerCase().includes(search),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data: { items, page, pageSize, total } });
  }),

  http.get(`${baseUrl}/meal-plans/:id`, ({ params }) => {
    const plan = mealPlans.find((p) => p.id === params.id);
    if (!plan) return HttpResponse.json({ message: "Meal plan not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: plan });
  }),

  http.post(`${baseUrl}/meal-plans`, async ({ request }) => {
    const body = (await request.json()) as Partial<MealPlan>;
    if (!body.memberName || !body.planName) {
      return HttpResponse.json(
        { message: "Member and plan name are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const plan: MealPlan = {
      id: `meal_${nextId++}`,
      memberName: body.memberName,
      planName: body.planName,
      dailyCalories: body.dailyCalories ?? 2000,
      compliance: 0,
      status: "draft",
      createdOn: new Date().toISOString(),
    };
    mealPlans = [plan, ...mealPlans];
    return HttpResponse.json({ data: plan }, { status: 201 });
  }),

  http.patch(`${baseUrl}/meal-plans/:id`, async ({ params, request }) => {
    const index = mealPlans.findIndex((p) => p.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Meal plan not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<MealPlan>;
    const updated: MealPlan = { ...mealPlans[index]!, ...body };
    mealPlans = mealPlans.map((p) => (p.id === params.id ? updated : p));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/meal-plans/:id`, ({ params }) => {
    const exists = mealPlans.some((p) => p.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Meal plan not found.", code: "NOT_FOUND" }, { status: 404 });
    mealPlans = mealPlans.filter((p) => p.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
