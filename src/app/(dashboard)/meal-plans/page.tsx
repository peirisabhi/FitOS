import type { Metadata } from "next";
import { MealPlansTable } from "@/features/meal-plans";

export const metadata: Metadata = { title: "Meal Plans" };

export default function MealPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meal Plans</h1>
        <p className="text-sm text-muted-foreground">Assign and track nutrition plans.</p>
      </div>
      <MealPlansTable />
    </div>
  );
}
