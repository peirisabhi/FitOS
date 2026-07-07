"use client";

import { Activity, BadgeCheck } from "lucide-react";
import { DashboardCard, MetricCard } from "@/components/data-display";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QueryBoundary } from "@/components/feedback";
import { useMemberDashboard } from "@/features/dashboard/hooks";
import { ListWidgetCard, StatRow, GoalProgressCard, AttendanceHistoryChart } from "@/features/dashboard/components/widgets";
import type { MembershipStatus, PaymentHistoryItem } from "@/features/dashboard/types";

const MEMBERSHIP_BADGE: Record<MembershipStatus["status"], "success" | "warning" | "destructive"> = {
  active: "success",
  expiring: "warning",
  expired: "destructive",
};

const PAYMENT_BADGE: Record<PaymentHistoryItem["status"], "success" | "warning" | "destructive"> = {
  paid: "success",
  pending: "warning",
  overdue: "destructive",
};

export function MemberDashboard() {
  const { data, isLoading, isError, refetch } = useMemberDashboard();

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      data={data}
      onRetry={() => refetch()}
      loadingFallback={<DashboardSkeleton />}
      errorTitle="Couldn't load your dashboard"
    >
      {(dashboard) => (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Membership Status">
              <div className="space-y-2">
                <p className="text-lg font-semibold">{dashboard.membership.planName}</p>
                <Badge variant={MEMBERSHIP_BADGE[dashboard.membership.status]} className="capitalize">
                  {dashboard.membership.status}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Renews {new Date(dashboard.membership.renewsOn).toLocaleDateString()}
                </p>
              </div>
            </DashboardCard>

            <MetricCard
              label="BMI"
              value={dashboard.bmi.value.toFixed(1)}
              icon={Activity}
              trendLabel={dashboard.bmi.category}
            />

            <DashboardCard title="Meal Plan Compliance">
              <div className="space-y-2">
                <p className="text-2xl font-semibold">{dashboard.mealPlanCompliance}%</p>
                <Progress value={dashboard.mealPlanCompliance} />
              </div>
            </DashboardCard>

            <DashboardCard title="Workout Plan">
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  {dashboard.workoutPlan.planName}
                </p>
                <p className="text-xs text-muted-foreground">{dashboard.workoutPlan.focus}</p>
                <Progress value={dashboard.workoutPlan.weekProgress} />
                <p className="text-xs text-muted-foreground">Next: {dashboard.workoutPlan.nextWorkout}</p>
              </div>
            </DashboardCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AttendanceHistoryChart data={dashboard.attendanceHistory} />
            <GoalProgressCard goals={dashboard.goals} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListWidgetCard
              title="Upcoming Sessions"
              items={dashboard.upcomingSessions}
              getKey={(item) => item.id}
              emptyMessage="No sessions booked yet."
              renderItem={(item) => (
                <StatRow
                  title={item.title}
                  subtitle={item.location}
                  trailing={
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.start).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  }
                />
              )}
            />
            <ListWidgetCard
              title="Payments"
              items={dashboard.payments}
              getKey={(item) => item.id}
              emptyMessage="No payment history yet."
              renderItem={(item) => (
                <StatRow
                  title={item.description}
                  subtitle={new Date(item.paidOn).toLocaleDateString()}
                  trailing={
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${item.amount}</span>
                      <Badge variant={PAYMENT_BADGE[item.status]} className="capitalize">
                        {item.status}
                      </Badge>
                    </div>
                  }
                />
              )}
            />
          </div>

          <ListWidgetCard
            title="Notifications"
            items={dashboard.notifications}
            getKey={(item) => item.id}
            emptyMessage="You're all caught up."
            renderItem={(item) => (
              <StatRow
                title={item.title}
                subtitle={item.message}
                trailing={!item.read ? <Badge variant="secondary">New</Badge> : undefined}
              />
            )}
          />
        </div>
      )}
    </QueryBoundary>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
      ))}
    </div>
  );
}
