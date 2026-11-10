"use client";

import {
  Users,
  UserPlus,
  CalendarCheck,
  CreditCard,
  UserPlus2,
  Wallet,
  CalendarPlus,
  Megaphone,
} from "lucide-react";
import { MetricCard, DashboardCard, Timeline, Calendar } from "@/components/data-display";
import { StaggerFade } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { QueryBoundary } from "@/components/feedback";
import { RequirePermission } from "@/shared/components";
import { useOwnerDashboard } from "@/features/dashboard/hooks";
import {
  ListWidgetCard,
  StatRow,
  QuickActionsCard,
  RevenueTrendChart,
  MembershipDistributionChart,
  PeakHoursChart,
} from "@/features/dashboard/components/widgets";
import { ROUTES } from "@/constants/routes";

const QUICK_ACTIONS = [
  {
    label: "Add Member",
    href: ROUTES.members,
    icon: UserPlus2,
    requiredPermissions: ["members:write" as const],
  },
  {
    label: "Record Payment",
    href: ROUTES.payments,
    icon: Wallet,
    requiredPermissions: ["payments:write" as const],
  },
  {
    label: "New Session",
    href: ROUTES.sessions,
    icon: CalendarPlus,
    requiredPermissions: ["sessions:write" as const],
  },
  {
    label: "Post Announcement",
    href: ROUTES.noticeBoard,
    icon: Megaphone,
    requiredPermissions: ["notice-board:write" as const],
  },
];

function expiryBadgeVariant(daysRemaining: number): "destructive" | "warning" | "secondary" {
  if (daysRemaining <= 5) return "destructive";
  if (daysRemaining <= 10) return "warning";
  return "secondary";
}

export function OwnerDashboard() {
  const { data, isLoading, isError, refetch } = useOwnerDashboard();

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
          <RequirePermission
            permission={["members:write", "payments:write", "sessions:write", "notice-board:write"]}
          >
            <QuickActionsCard actions={QUICK_ACTIONS} />
          </RequirePermission>

          <StaggerFade className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RequirePermission permission="payments:read">
              <MetricCard
                label="Revenue (MTD)"
                value={`$${dashboard.revenueMtd.toLocaleString()}`}
                icon={CreditCard}
                trend={dashboard.revenueTrendPct}
                trendLabel="vs last month"
              />
            </RequirePermission>
            <RequirePermission permission="attendance:read">
              <MetricCard
                label="Today's Attendance"
                value={dashboard.todaysAttendance.toLocaleString()}
                icon={CalendarCheck}
                trend={dashboard.attendanceTrendPct}
                trendLabel="vs yesterday"
              />
            </RequirePermission>
            <RequirePermission permission="members:read">
              <MetricCard
                label="Active Members"
                value={dashboard.activeMembers.toLocaleString()}
                icon={Users}
                trend={dashboard.activeMembersTrendPct}
                trendLabel="vs last month"
              />
            </RequirePermission>
            <RequirePermission permission="members:read">
              <MetricCard
                label="New Members (MTD)"
                value={dashboard.newMembersThisMonth.toString()}
                icon={UserPlus}
              />
            </RequirePermission>
          </StaggerFade>

          <div className="grid gap-4 lg:grid-cols-2">
            <RequirePermission permission="payments:read">
              <RevenueTrendChart data={dashboard.revenueTrend} />
            </RequirePermission>
            <RequirePermission permission="memberships:read">
              <MembershipDistributionChart data={dashboard.membershipDistribution} />
            </RequirePermission>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RequirePermission permission="attendance:read">
              <PeakHoursChart data={dashboard.peakHours} />
            </RequirePermission>
            <RequirePermission permission="trainers:read">
              <ListWidgetCard
                title="Trainer Performance"
                items={dashboard.trainerPerformance}
                getKey={(item) => item.id}
                renderItem={(item) => (
                  <StatRow
                    title={item.trainerName}
                    subtitle={`${item.sessionsCompleted} sessions · ${item.retentionRate}% retention`}
                    trailing={<Badge variant="secondary">★ {item.rating}</Badge>}
                  />
                )}
              />
            </RequirePermission>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RequirePermission permission="memberships:read">
              <ListWidgetCard
                title="Membership Expiry"
                description="Renewing in the next 2 weeks"
                items={dashboard.membershipExpiring}
                getKey={(item) => item.id}
                emptyMessage="No memberships expiring soon."
                renderItem={(item) => (
                  <StatRow
                    title={item.memberName}
                    subtitle={item.planName}
                    trailing={
                      <Badge variant={expiryBadgeVariant(item.daysRemaining)}>
                        {item.daysRemaining}d left
                      </Badge>
                    }
                  />
                )}
              />
            </RequirePermission>
            <RequirePermission permission="payments:read">
              <ListWidgetCard
                title="Pending Payments"
                items={dashboard.pendingPayments}
                getKey={(item) => item.id}
                emptyMessage="No payments pending."
                renderItem={(item) => (
                  <StatRow
                    title={item.memberName}
                    subtitle={`Due ${new Date(item.dueOn).toLocaleDateString()}`}
                    trailing={<span className="text-sm font-medium">${item.amount}</span>}
                  />
                )}
              />
            </RequirePermission>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardCard title="Recent Activity">
              <Timeline
                items={dashboard.recentActivity.map((a) => ({
                  id: a.id,
                  title: a.title,
                  description: a.description,
                  timestamp: a.timestamp,
                }))}
              />
            </DashboardCard>
            <RequirePermission permission="notice-board:read">
              <ListWidgetCard
                title="Announcements"
                items={dashboard.announcements}
                getKey={(item) => item.id}
                emptyMessage="No announcements posted."
                renderItem={(item) => (
                  <StatRow
                    title={item.title}
                    subtitle={item.body}
                    trailing={item.pinned ? <Badge>Pinned</Badge> : undefined}
                  />
                )}
              />
            </RequirePermission>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RequirePermission permission="sessions:read">
              <DashboardCard title="Calendar" description="Upcoming sessions & classes">
                <Calendar
                  events={dashboard.upcomingSessions.map((s) => ({
                    id: s.id,
                    title: s.memberName ? `${s.title} — ${s.memberName}` : s.title,
                    start: s.start,
                    end: s.end,
                  }))}
                  initialView="dayGridMonth"
                />
              </DashboardCard>
            </RequirePermission>
            <RequirePermission permission="notifications:read">
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
            </RequirePermission>
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
