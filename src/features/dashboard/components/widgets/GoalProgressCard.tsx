import { DashboardCard } from "@/components/data-display";
import { Progress } from "@/components/ui/progress";
import type { GoalProgressItem } from "@/features/dashboard/types";

function toPercent(current: number, target: number): number {
  if (target === 0) return 0;
  // Handles both "increase toward target" (e.g. bench press) and
  // "decrease toward target" (e.g. body weight, run time) goals.
  const pct = target > current ? (current / target) * 100 : (target / current) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function GoalProgressCard({ goals }: { goals: GoalProgressItem[] }) {
  return (
    <DashboardCard title="Goal Progress">
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-1.5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{goal.label}</span>
              <span className="text-muted-foreground">
                {goal.current}
                {goal.unit} → {goal.target}
                {goal.unit}
              </span>
            </div>
            <Progress value={toPercent(goal.current, goal.target)} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
