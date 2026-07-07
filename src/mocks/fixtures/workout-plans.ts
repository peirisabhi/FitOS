import type { WorkoutPlan } from "@/features/workout-plans/types";

const ENTRIES: Array<[string, string, string, number, WorkoutPlan["status"]]> = [
  ["Jordan Blake", "Lean & Strong — Phase 2", "Upper body strength + conditioning", 60, "active"],
  ["Priya Nair", "Foundational Strength", "Full body, 3x/week", 41, "active"],
  ["Tom Baker", "Endurance Builder", "Cardio + mobility", 78, "active"],
  ["Sarah Chen", "Summer Shred", "HIIT + core", 25, "active"],
  ["Marcus Webb", "Rehab & Recomposition", "Low-impact strength", 0, "draft"],
  ["Elena Ruiz", "Competition Prep", "Powerlifting peaking block", 100, "completed"],
];

function seedDate(daysAgo: number): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const MOCK_WORKOUT_PLANS: WorkoutPlan[] = ENTRIES.map(([memberName, planName, focus, weekProgress, status], i) => ({
  id: `wk_${i + 1}`,
  memberName,
  planName,
  focus,
  weekProgress,
  status,
  createdOn: seedDate(14 + i * 12),
}));
