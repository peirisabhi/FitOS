/**
 * Shared row shapes reused across dashboard variants (architecture doc §9,
 * Milestone 2). These model the mock API response — the same shapes a real
 * NestJS `/dashboard/*` endpoint would return.
 */
export interface TrendPoint {
  label: string;
  value: number;
}

export interface MembershipDistributionSlice {
  label: string;
  value: number;
}

export interface PeakHourPoint {
  hour: string;
  visits: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  postedAt: string;
  pinned?: boolean;
}

export interface MembershipExpiryItem {
  id: string;
  memberName: string;
  planName: string;
  expiresOn: string;
  daysRemaining: number;
}

export interface PendingPaymentItem {
  id: string;
  memberName: string;
  amount: number;
  dueOn: string;
}

export interface TrainerPerformanceItem {
  id: string;
  trainerName: string;
  sessionsCompleted: number;
  rating: number;
  retentionRate: number;
}

export interface SessionItem {
  id: string;
  title: string;
  memberName?: string;
  start: string;
  end: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AssignedMemberItem {
  id: string;
  name: string;
  goal: string;
  lastSession: string;
  progress: number;
}

export interface MealPlanSummaryItem {
  id: string;
  memberName: string;
  planName: string;
  compliance: number;
}

export interface WorkoutPlanSummary {
  planName: string;
  focus: string;
  weekProgress: number;
  nextWorkout: string;
}

export interface MembershipStatus {
  planName: string;
  status: "active" | "expiring" | "expired";
  renewsOn: string;
}

export interface PaymentHistoryItem {
  id: string;
  description: string;
  amount: number;
  paidOn: string;
  status: "paid" | "pending" | "overdue";
}

export interface AttendanceHistoryPoint {
  label: string;
  visits: number;
}

export interface GoalProgressItem {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface BmiSummary {
  value: number;
  category: "Underweight" | "Healthy" | "Overweight" | "Obese";
  heightCm: number;
  weightKg: number;
}

/** Owner (and manager / receptionist / super_admin, permission-gated) dashboard. */
export interface OwnerDashboardData {
  revenueMtd: number;
  revenueTrendPct: number;
  todaysAttendance: number;
  attendanceTrendPct: number;
  activeMembers: number;
  activeMembersTrendPct: number;
  newMembersThisMonth: number;
  membershipExpiring: MembershipExpiryItem[];
  pendingPayments: PendingPaymentItem[];
  trainerPerformance: TrainerPerformanceItem[];
  membershipDistribution: MembershipDistributionSlice[];
  revenueTrend: TrendPoint[];
  peakHours: PeakHourPoint[];
  recentActivity: ActivityItem[];
  announcements: AnnouncementItem[];
  upcomingSessions: SessionItem[];
  notifications: NotificationItem[];
}

export interface TrainerDashboardData {
  todaysSessions: SessionItem[];
  upcomingSessions: SessionItem[];
  assignedMembers: AssignedMemberItem[];
  mealPlans: MealPlanSummaryItem[];
  attendanceThisWeek: number;
  attendanceTrendPct: number;
  sessionsCompletedThisMonth: number;
  averageRating: number;
  memberRetentionRate: number;
  notifications: NotificationItem[];
}

export interface MemberDashboardData {
  membership: MembershipStatus;
  workoutPlan: WorkoutPlanSummary;
  mealPlanCompliance: number;
  attendanceHistory: AttendanceHistoryPoint[];
  payments: PaymentHistoryItem[];
  upcomingSessions: SessionItem[];
  notifications: NotificationItem[];
  bmi: BmiSummary;
  goals: GoalProgressItem[];
}

export interface IDashboardRepository {
  getOwnerSummary(): Promise<OwnerDashboardData>;
  getTrainerSummary(): Promise<TrainerDashboardData>;
  getMemberSummary(): Promise<MemberDashboardData>;
}
