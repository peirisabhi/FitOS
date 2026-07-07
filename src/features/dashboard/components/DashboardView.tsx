"use client";

import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { OwnerDashboard } from "@/features/dashboard/components/OwnerDashboard";
import { TrainerDashboard } from "@/features/dashboard/components/TrainerDashboard";
import { MemberDashboard } from "@/features/dashboard/components/MemberDashboard";
import { getDashboardVariant } from "@/features/dashboard/utils";

/**
 * Renders one of the three named dashboards (architecture doc §9,
 * Milestone 2) based on the signed-in user's roles — see
 * `getDashboardVariant()`. The shell/layout stays identical across all
 * three (Milestone 1 decision); only widget composition changes here.
 */
export function DashboardView() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated || !user) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const variant = getDashboardVariant(user.roles);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening at your gym today.</p>
      </div>

      {variant === "owner" && <OwnerDashboard />}
      {variant === "trainer" && <TrainerDashboard />}
      {variant === "member" && <MemberDashboard />}
    </div>
  );
}
