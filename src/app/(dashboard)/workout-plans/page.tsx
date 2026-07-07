import type { Metadata } from "next";
import { WorkoutPlansTable } from "@/features/workout-plans";

export const metadata: Metadata = { title: "Workout Plans" };

export default function WorkoutPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Workout Plans</h1>
        <p className="text-sm text-muted-foreground">Build and assign training programs.</p>
      </div>
      <WorkoutPlansTable />
    </div>
  );
}
