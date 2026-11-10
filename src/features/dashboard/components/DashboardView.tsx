"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardVariant } from "@/features/dashboard/utils";

/**
 * Milestone 5 performance pass: each variant pulls in its own chart-heavy
 * widgets (Recharts, and for the owner variant, FullCalendar). Only one
 * variant ever renders for a given user, so lazy-loading them means a
 * trainer's bundle never pays for the owner dashboard's chart code (and
 * vice versa) — see architecture doc §"Performance".
 */
const DASHBOARD_SKELETON = (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-28 rounded-xl" />
    ))}
  </div>
);

const OwnerDashboard = dynamic(
  () => import("@/features/dashboard/components/OwnerDashboard").then((m) => m.OwnerDashboard),
  { loading: () => DASHBOARD_SKELETON },
);
const TrainerDashboard = dynamic(
  () => import("@/features/dashboard/components/TrainerDashboard").then((m) => m.TrainerDashboard),
  { loading: () => DASHBOARD_SKELETON },
);
const MemberDashboard = dynamic(
  () => import("@/features/dashboard/components/MemberDashboard").then((m) => m.MemberDashboard),
  { loading: () => DASHBOARD_SKELETON },
);

/**
 * Renders one of the three named dashboards (architecture doc §9,
 * Milestone 2) based on the signed-in user's roles — see
 * `getDashboardVariant()`. The shell/layout stays identical across all
 * three (Milestone 1 decision); only widget composition changes here.
 */
export function DashboardView() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated || !user) {
    return DASHBOARD_SKELETON;
  }

  const variant = getDashboardVariant(user.roles);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s what&apos;s happening at your gym today.
        </p>
      </div>

      {variant === "owner" && <OwnerDashboard />}
      {variant === "trainer" && <TrainerDashboard />}
      {variant === "member" && <MemberDashboard />}
    </div>
  );
}
