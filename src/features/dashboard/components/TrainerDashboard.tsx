"use client";

import { CalendarClock, Star, TrendingUp, Users } from "lucide-react";
import { MetricCard, DashboardCard } from "@/components/data-display";
import { StaggerFade } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QueryBoundary } from "@/components/feedback";
import { useTrainerDashboard } from "@/features/dashboard/hooks";
import { ListWidgetCard, StatRow, QuickActionsCard } from "@/features/dashboard/components/widgets";
import { ROUTES } from "@/constants/routes";

const QUICK_ACTIONS = [
  {
    label: "Log Attendance",
    href: ROUTES.attendance,
    icon: CalendarClock,
    requiredPermissions: ["attendance:write" as const],
  },
  {
    label: "New Session",
    href: ROUTES.sessions,
    icon: CalendarClock,
    requiredPermissions: ["sessions:write" as const],
  },
  {
    label: "Update Workout Plan",
    href: ROUTES.workoutPlans,
    icon: TrendingUp,
    requiredPermissions: ["workout-plans:write" as const],
  },
  {
    label: "Update Meal Plan",
    href: ROUTES.mealPlans,
    icon: Users,
    requiredPermissions: ["meal-plans:write" as const],
  },
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function TrainerDashboard() {
  const { data, isLoading, isError, refetch } = useTrainerDashboard();

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
          <QuickActionsCard actions={QUICK_ACTIONS} />

          <StaggerFade className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Attendance (this week)"
              value={dashboard.attendanceThisWeek.toString()}
              icon={CalendarClock}
              trend={dashboard.attendanceTrendPct}
              trendLabel="vs last week"
            />
            <MetricCard
              label="Sessions (this month)"
              value={dashboard.sessionsCompletedThisMonth.toString()}
              icon={TrendingUp}
            />
            <MetricCard
              label="Average Rating"
              value={dashboard.averageRating.toFixed(1)}
              icon={Star}
            />
            <MetricCard
              label="Member Retention"
              value={`${dashboard.memberRetentionRate}%`}
              icon={Users}
            />
          </StaggerFade>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListWidgetCard
              title="Today's Sessions"
              items={dashboard.todaysSessions}
              getKey={(item) => item.id}
              emptyMessage="No sessions scheduled today."
              renderItem={(item) => (
                <StatRow
                  title={item.title}
                  subtitle={item.memberName ?? item.location}
                  trailing={
                    <span className="text-muted-foreground text-sm">{formatTime(item.start)}</span>
                  }
                />
              )}
            />
            <ListWidgetCard
              title="Upcoming Sessions"
              items={dashboard.upcomingSessions}
              getKey={(item) => item.id}
              emptyMessage="Nothing scheduled yet."
              renderItem={(item) => (
                <StatRow
                  title={item.title}
                  subtitle={item.memberName ?? item.location}
                  trailing={
                    <span className="text-muted-foreground text-sm">
                      {new Date(item.start).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  }
                />
              )}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListWidgetCard
              title="Assigned Members"
              items={dashboard.assignedMembers}
              getKey={(item) => item.id}
              emptyMessage="No members assigned yet."
              renderItem={(item) => (
                <StatRow
                  title={item.name}
                  subtitle={`Goal: ${item.goal} · Last session ${item.lastSession}`}
                  trailing={<Badge variant="secondary">{item.progress}%</Badge>}
                />
              )}
            />
            <DashboardCard title="Workout Progress">
              <div className="space-y-4">
                {dashboard.assignedMembers.map((member) => (
                  <div key={member.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{member.name}</span>
                      <span className="text-muted-foreground">{member.progress}%</span>
                    </div>
                    <Progress value={member.progress} />
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListWidgetCard
              title="Meal Plans"
              description="Assigned members' compliance"
              items={dashboard.mealPlans}
              getKey={(item) => item.id}
              emptyMessage="No meal plans assigned."
              renderItem={(item) => (
                <StatRow
                  title={item.memberName}
                  subtitle={item.planName}
                  trailing={<Badge variant="secondary">{item.compliance}% compliant</Badge>}
                />
              )}
            />
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
        </div>
      )}
    </QueryBoundary>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-muted/40 h-28 animate-pulse rounded-xl border" />
      ))}
    </div>
  );
}
