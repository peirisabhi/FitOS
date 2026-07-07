/**
 * Granular permission strings, grouped by module as `module:action`.
 * Adding a module means adding entries here + to the role matrix in
 * `config/permissions.config.ts` — nowhere else.
 */
export const PERMISSIONS = [
  // dashboard
  "dashboard:view",
  // members
  "members:read",
  "members:write",
  "members:delete",
  // trainers
  "trainers:read",
  "trainers:write",
  "trainers:delete",
  // attendance
  "attendance:read",
  "attendance:write",
  // payments
  "payments:read",
  "payments:write",
  // memberships
  "memberships:read",
  "memberships:write",
  // meal plans
  "meal-plans:read",
  "meal-plans:write",
  // workout plans
  "workout-plans:read",
  "workout-plans:write",
  // sessions
  "sessions:read",
  "sessions:write",
  // reports
  "reports:read",
  "reports:export",
  // notifications
  "notifications:read",
  "notifications:write",
  // notice board
  "notice-board:read",
  "notice-board:write",
  // settings
  "settings:read",
  "settings:write",
  // tenant / org-level admin
  "org:manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
