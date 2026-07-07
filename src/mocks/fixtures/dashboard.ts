import type {
  OwnerDashboardData,
  TrainerDashboardData,
  MemberDashboardData,
} from "@/features/dashboard/types";

/**
 * Deterministic mock dashboard data (architecture doc §9, Milestone 2).
 * Deterministic (no Math.random) so screenshots/tests are stable and the
 * numbers tell a coherent story across widgets (e.g. revenue trend ends at
 * the same MTD figure the Revenue metric card shows).
 */
export function buildOwnerDashboard(): OwnerDashboardData {
  return {
    revenueMtd: 48230,
    revenueTrendPct: 8.6,
    todaysAttendance: 312,
    attendanceTrendPct: -1.1,
    activeMembers: 1284,
    activeMembersTrendPct: 4.2,
    newMembersThisMonth: 57,
    membershipExpiring: [
      { id: "exp_1", memberName: "Sarah Chen", planName: "Annual Elite", expiresOn: "2026-07-10", daysRemaining: 3 },
      { id: "exp_2", memberName: "Marcus Webb", planName: "Monthly Plus", expiresOn: "2026-07-12", daysRemaining: 5 },
      { id: "exp_3", memberName: "Elena Ruiz", planName: "Quarterly", expiresOn: "2026-07-15", daysRemaining: 8 },
      { id: "exp_4", memberName: "Tom Baker", planName: "Monthly Basic", expiresOn: "2026-07-18", daysRemaining: 11 },
    ],
    pendingPayments: [
      { id: "pay_1", memberName: "Ravi Kumar", amount: 89, dueOn: "2026-07-09" },
      { id: "pay_2", memberName: "Lucy Grant", amount: 129, dueOn: "2026-07-11" },
      { id: "pay_3", memberName: "Ahmed Farouk", amount: 59, dueOn: "2026-07-14" },
    ],
    trainerPerformance: [
      { id: "tp_1", trainerName: "Diego Alvarez", sessionsCompleted: 142, rating: 4.9, retentionRate: 92 },
      { id: "tp_2", trainerName: "Nina Patel", sessionsCompleted: 128, rating: 4.7, retentionRate: 88 },
      { id: "tp_3", trainerName: "Chris Doyle", sessionsCompleted: 96, rating: 4.5, retentionRate: 81 },
    ],
    membershipDistribution: [
      { label: "Monthly", value: 540 },
      { label: "Quarterly", value: 310 },
      { label: "Annual", value: 380 },
      { label: "Day Pass", value: 54 },
    ],
    revenueTrend: [
      { label: "Feb", value: 36200 },
      { label: "Mar", value: 38950 },
      { label: "Apr", value: 41100 },
      { label: "May", value: 43850 },
      { label: "Jun", value: 44420 },
      { label: "Jul", value: 48230 },
    ],
    peakHours: [
      { hour: "6am", visits: 42 },
      { hour: "9am", visits: 68 },
      { hour: "12pm", visits: 54 },
      { hour: "3pm", visits: 38 },
      { hour: "6pm", visits: 121 },
      { hour: "9pm", visits: 76 },
    ],
    recentActivity: [
      { id: "act_1", title: "New member joined", description: "Jordan Blake signed up for Annual Elite", timestamp: "10 min ago" },
      { id: "act_2", title: "Payment received", description: "$129 from Lucy Grant", timestamp: "42 min ago" },
      { id: "act_3", title: "Session completed", description: "Diego Alvarez finished a session with 3 members", timestamp: "1 hr ago" },
      { id: "act_4", title: "Membership renewed", description: "Elena Ruiz renewed Quarterly plan", timestamp: "3 hr ago" },
    ],
    announcements: [
      { id: "ann_1", title: "New yoga classes starting Monday", body: "Join our new evening yoga sessions, 3 slots/week.", postedAt: "2026-07-05", pinned: true },
      { id: "ann_2", title: "Holiday hours", body: "We'll be open reduced hours on public holidays this month.", postedAt: "2026-07-02" },
    ],
    upcomingSessions: [
      { id: "sess_1", title: "HIIT Group Class", start: "2026-07-07T18:00:00", end: "2026-07-07T19:00:00", location: "Studio A" },
      { id: "sess_2", title: "1:1 Strength Coaching", memberName: "Ravi Kumar", start: "2026-07-08T09:00:00", end: "2026-07-08T10:00:00", location: "Floor 2" },
    ],
    notifications: [
      { id: "notif_1", title: "Low equipment stock", message: "Resistance bands running low in Studio B.", createdAt: "2 hr ago", read: false },
      { id: "notif_2", title: "New feedback received", message: "A member left a 5-star review.", createdAt: "5 hr ago", read: true },
    ],
  };
}

export function buildTrainerDashboard(): TrainerDashboardData {
  return {
    todaysSessions: [
      { id: "tsess_1", title: "Strength Coaching", memberName: "Jordan Blake", start: "2026-07-07T08:00:00", end: "2026-07-07T09:00:00", location: "Floor 2" },
      { id: "tsess_2", title: "HIIT Group Class", start: "2026-07-07T18:00:00", end: "2026-07-07T19:00:00", location: "Studio A" },
    ],
    upcomingSessions: [
      { id: "tsess_3", title: "Mobility & Recovery", memberName: "Priya Nair", start: "2026-07-08T10:00:00", end: "2026-07-08T11:00:00", location: "Studio C" },
      { id: "tsess_4", title: "Strength Coaching", memberName: "Jordan Blake", start: "2026-07-09T08:00:00", end: "2026-07-09T09:00:00", location: "Floor 2" },
    ],
    assignedMembers: [
      { id: "am_1", name: "Jordan Blake", goal: "Lose 5kg", lastSession: "Yesterday", progress: 62 },
      { id: "am_2", name: "Priya Nair", goal: "Build strength", lastSession: "2 days ago", progress: 41 },
      { id: "am_3", name: "Tom Baker", goal: "Improve endurance", lastSession: "4 days ago", progress: 78 },
    ],
    mealPlans: [
      { id: "mp_1", memberName: "Jordan Blake", planName: "Lean Cut 2200 kcal", compliance: 88 },
      { id: "mp_2", memberName: "Priya Nair", planName: "Strength Bulk 2800 kcal", compliance: 74 },
    ],
    attendanceThisWeek: 18,
    attendanceTrendPct: 6.5,
    sessionsCompletedThisMonth: 46,
    averageRating: 4.9,
    memberRetentionRate: 92,
    notifications: [
      { id: "tnotif_1", title: "Session rescheduled", message: "Priya Nair moved her Wed session to Thu.", createdAt: "1 hr ago", read: false },
      { id: "tnotif_2", title: "New assignment", message: "Tom Baker was assigned to you.", createdAt: "1 day ago", read: true },
    ],
  };
}

export function buildMemberDashboard(): MemberDashboardData {
  return {
    membership: { planName: "Annual Elite", status: "active", renewsOn: "2027-02-14" },
    workoutPlan: {
      planName: "Lean & Strong — Phase 2",
      focus: "Upper body strength + conditioning",
      weekProgress: 60,
      nextWorkout: "Push Day — Tomorrow, 7:00 AM",
    },
    mealPlanCompliance: 82,
    attendanceHistory: [
      { label: "Mon", visits: 1 },
      { label: "Tue", visits: 0 },
      { label: "Wed", visits: 1 },
      { label: "Thu", visits: 1 },
      { label: "Fri", visits: 0 },
      { label: "Sat", visits: 1 },
      { label: "Sun", visits: 0 },
    ],
    payments: [
      { id: "mpay_1", description: "Annual Elite renewal", amount: 899, paidOn: "2026-02-14", status: "paid" },
      { id: "mpay_2", description: "Personal training add-on", amount: 120, paidOn: "2026-06-01", status: "paid" },
    ],
    upcomingSessions: [
      { id: "msess_1", title: "Strength Coaching with Diego", start: "2026-07-08T08:00:00", end: "2026-07-08T09:00:00", location: "Floor 2" },
    ],
    notifications: [
      { id: "mnotif_1", title: "Great streak!", message: "You've hit the gym 4 times this week.", createdAt: "3 hr ago", read: false },
      { id: "mnotif_2", title: "Plan updated", message: "Your trainer updated your workout plan.", createdAt: "1 day ago", read: true },
    ],
    bmi: { value: 23.4, category: "Healthy", heightCm: 178, weightKg: 74 },
    goals: [
      { id: "goal_1", label: "Body weight", current: 74, target: 70, unit: "kg" },
      { id: "goal_2", label: "5k run time", current: 27, target: 24, unit: "min" },
      { id: "goal_3", label: "Bench press", current: 65, target: 80, unit: "kg" },
    ],
  };
}
