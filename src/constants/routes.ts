/**
 * Central route table. Never hardcode a path string in a component —
 * import from here so a route rename is a one-file change.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  members: "/members",
  trainers: "/trainers",
  attendance: "/attendance",
  payments: "/payments",
  memberships: "/memberships",
  mealPlans: "/meal-plans",
  workoutPlans: "/workout-plans",
  sessions: "/sessions",
  reports: "/reports",
  notifications: "/notifications",
  noticeBoard: "/notice-board",
  settings: "/settings",
  forbidden: "/403",
} as const;

export type RouteKey = keyof typeof ROUTES;
