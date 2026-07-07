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
  },
  payments: {
    all: () => ["payments"] as const,
  },
  memberships: {
    all: () => ["memberships"] as const,
  },
  sessions: {
    all: () => ["sessions"] as const,
  },
  dashboard: {
    owner: () => ["dashboard", "owner"] as const,
    trainer: () => ["dashboard", "trainer"] as const,
    member: () => ["dashboard", "member"] as const,
  },
} as const;
