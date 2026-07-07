import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_WORKOUT_PLANS } from "@/mocks/fixtures/workout-plans";
import type { WorkoutPlan } from "@/features/workout-plans/types";

const baseUrl = siteConfig.api.baseUrl;

let workoutPlans: WorkoutPlan[] = [...MOCK_WORKOUT_PLANS];
let nextId = workoutPlans.length + 1;

export const workoutPlansHandlers = [
  http.get(`${baseUrl}/workout-plans`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 10);

    let filtered = workoutPlans;
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

  http.get(`${baseUrl}/workout-plans/:id`, ({ params }) => {
    const plan = workoutPlans.find((p) => p.id === params.id);
    if (!plan) return HttpResponse.json({ message: "Workout plan not found.", code: "NOT_FOUND" }, { status: 404 });
    return HttpResponse.json({ data: plan });
  }),

  http.post(`${baseUrl}/workout-plans`, async ({ request }) => {
    const body = (await request.json()) as Partial<WorkoutPlan>;
    if (!body.memberName || !body.planName) {
      return HttpResponse.json(
        { message: "Member and plan name are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const plan: WorkoutPlan = {
      id: `wk_${nextId++}`,
      memberName: body.memberName,
      planName: body.planName,
      focus: body.focus ?? "General fitness",
      weekProgress: 0,
      status: "draft",
      createdOn: new Date().toISOString(),
    };
    workoutPlans = [plan, ...workoutPlans];
    return HttpResponse.json({ data: plan }, { status: 201 });
  }),

  http.patch(`${baseUrl}/workout-plans/:id`, async ({ params, request }) => {
    const index = workoutPlans.findIndex((p) => p.id === params.id);
    if (index === -1) return HttpResponse.json({ message: "Workout plan not found.", code: "NOT_FOUND" }, { status: 404 });
    const body = (await request.json()) as Partial<WorkoutPlan>;
    const updated: WorkoutPlan = { ...workoutPlans[index]!, ...body };
    workoutPlans = workoutPlans.map((p) => (p.id === params.id ? updated : p));
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${baseUrl}/workout-plans/:id`, ({ params }) => {
    const exists = workoutPlans.some((p) => p.id === params.id);
    if (!exists) return HttpResponse.json({ message: "Workout plan not found.", code: "NOT_FOUND" }, { status: 404 });
    workoutPlans = workoutPlans.filter((p) => p.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
