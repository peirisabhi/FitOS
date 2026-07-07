export const siteConfig = {
  name: "GymOS",
  description: "Gym Operating System — a modern cloud-based multi-tenant SaaS platform for gyms.",
  defaultTheme: "system" as const,
  session: {
    /** Mock session lifetime, ms. */
    ttlMs: 1000 * 60 * 60 * 8, // 8 hours
    /** "Remember me" extends the mock session lifetime. */
    rememberMeTtlMs: 1000 * 60 * 60 * 24 * 14, // 14 days
    cookieName: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "gymos_session",
    /** How often the client re-checks expiry against `expiresAt`. */
    expiryCheckIntervalMs: 30_000,
  },
  api: {
    mode: (process.env.NEXT_PUBLIC_API_MODE as "mock" | "rest") ?? "mock",
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1",
  },
} as const;
