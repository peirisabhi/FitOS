/**
 * TanStack Query key factory. One factory per feature, namespaced, so
 * invalidation (`queryClient.invalidateQueries`) is precise and typo-proof.
 */
export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },
  members: {
    all: () => ["members"] as const,
    list: (filters?: Record<string, unknown>) => ["members", "list", filters ?? {}] as const,
    detail: (id: string) => ["members", "detail", id] as const,
  },
  trainers: {
    all: () => ["trainers"] as const,
    list: (filters?: Record<string, unknown>) => ["trainers", "list", filters ?? {}] as const,
  },
  attendance: {
    all: () => ["attendance"] as const,
    list: (filters?: Record<string, unknown>) => ["attendance", "list", filters ?? {}] as const,
  },
  payments: {
    all: () => ["payments"] as const,
    list: (filters?: Record<string, unknown>) => ["payments", "list", filters ?? {}] as const,
  },
  memberships: {
    all: () => ["memberships"] as const,
    list: (filters?: Record<string, unknown>) => ["memberships", "list", filters ?? {}] as const,
  },
  sessions: {
    all: () => ["sessions"] as const,
    list: (filters?: Record<string, unknown>) => ["sessions", "list", filters ?? {}] as const,
  },
  mealPlans: {
    all: () => ["meal-plans"] as const,
    list: (filters?: Record<string, unknown>) => ["meal-plans", "list", filters ?? {}] as const,
  },
  workoutPlans: {
    all: () => ["workout-plans"] as const,
    list: (filters?: Record<string, unknown>) => ["workout-plans", "list", filters ?? {}] as const,
  },
  dashboard: {
    owner: () => ["dashboard", "owner"] as const,
    trainer: () => ["dashboard", "trainer"] as const,
    member: () => ["dashboard", "member"] as const,
  },
  reports: {
    summary: (period?: string) => ["reports", "summary", period ?? "12m"] as const,
  },
  notifications: {
    all: () => ["notifications"] as const,
    list: (filters?: Record<string, unknown>) => ["notifications", "list", filters ?? {}] as const,
  },
  noticeBoard: {
    all: () => ["notice-board"] as const,
    list: (filters?: Record<string, unknown>) => ["notice-board", "list", filters ?? {}] as const,
  },
  settings: {
    organization: () => ["settings", "organization"] as const,
    profile: () => ["settings", "profile"] as const,
    notificationPreferences: () => ["settings", "notification-preferences"] as const,
  },
} as const;
