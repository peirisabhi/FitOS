import type { MealPlan } from "@/features/meal-plans/types";

const ENTRIES: Array<[string, string, number, number, MealPlan["status"]]> = [
  ["Jordan Blake", "Lean Cut 2200 kcal", 2200, 88, "active"],
  ["Priya Nair", "Strength Bulk 2800 kcal", 2800, 74, "active"],
  ["Tom Baker", "Maintenance 2400 kcal", 2400, 91, "active"],
  ["Sarah Chen", "Cutting Phase 1900 kcal", 1900, 65, "active"],
  ["Marcus Webb", "Recomposition 2300 kcal", 2300, 0, "draft"],
  ["Elena Ruiz", "Post-Comp Reverse Diet", 2600, 100, "completed"],
];

function seedDate(daysAgo: number): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const MOCK_MEAL_PLANS: MealPlan[] = ENTRIES.map(([memberName, planName, dailyCalories, compliance, status], i) => ({
  id: `meal_${i + 1}`,
  memberName,
  planName,
  dailyCalories,
  compliance,
  status,
  createdOn: seedDate(10 + i * 14),
}));
