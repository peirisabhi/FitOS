# GymOS — Milestone 1 + 2

Milestone 1: tooling, folder structure, theme, design system, base layouts, config-driven
navigation, mock auth, MSW + repository layer, route guards, dashboard shell.

Milestone 2: the three named dashboard experiences (Owner, Trainer, Member) with real widget
compositions over mocked data.

See `GymOS-Architecture-v1.md` for the full architecture write-up (folder structure rationale,
dependency graph, routing strategy, state management strategy, repository pattern, RBAC/PBAC
design).

## Important: install dependencies locally

This project was scaffolded in a sandboxed environment with no access to the npm registry, so
`node_modules` was never installed here and no build/typecheck could be run in-sandbox. Every
file was hand-written against the exact library APIs it depends on, but you should treat the
first local install + typecheck as the real verification step:

```bash
pnpm install
cp .env.example .env.local
pnpm run msw:init      # generates public/mockServiceWorker.js (required for mock auth to work)
pnpm run typecheck
pnpm dev
```

If `pnpm typecheck` or `pnpm dev` surface anything (a version mismatch in a pinned dependency,
a Radix API that shifted slightly), it's expected to be minor — flag it and it can be fixed in
a follow-up pass without touching the architecture.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@gymos.com | Admin@123 |
| Owner | owner@gymos.com | Owner@123 |
| Manager | manager@gymos.com | Manager@123 |
| Trainer | trainer@gymos.com | Trainer@123 |
| Receptionist | reception@gymos.com | Reception@123 |
| Member | member@gymos.com | Member@123 |

## What's in Milestone 1

- **Tooling**: TypeScript strict mode, Tailwind v4, ESLint (incl. `eslint-plugin-boundaries` for
  feature-isolation enforcement), Prettier, Husky + lint-staged.
- **Design system** (`src/components/ui`, `src/components/data-display`, `.../feedback`,
  `.../navigation`, `.../overlays`): every primitive and composite component from the brief —
  Button, Input, Select, Combobox/Search, Dialog, Sheet, DataTable, MetricCard, DashboardCard,
  ChartCard, Calendar, Timeline, Sidebar, Navbar, Breadcrumb, Pagination, ProfileCard, Skeletons,
  EmptyState, ErrorState, PermissionDenied, 404, 500, Maintenance.
- **Theme**: CSS-variable tokens, light/dark/system via `next-themes`.
- **Mock auth**: login, logout, remember me, forgot password, reset password, session expiration,
  role/permission detection — all served by MSW against `/api/v1/auth/*`, identical contract a
  real NestJS backend would answer.
- **Repository pattern**: `lib/http-client.ts` is the only place that calls `fetch`; repositories
  never know whether MSW or a real API answers. Going live is `NEXT_PUBLIC_API_MODE=rest` — zero
  repository/service/hook changes.
- **RBAC/PBAC**: `config/roles.config.ts`, `config/permissions.config.ts`,
  `config/navigation.config.ts` are the only places role/permission/menu knowledge lives.
  Multi-role users supported via `resolvePermissions()` (union across roles).
- **Route guards**: `middleware.ts` (route-level, SSR-safe) + `usePermission()` /
  `<RequirePermission>` (UI-level) — both call the same `resolvePermissions()`.
- **Dashboard shell**: one `DashboardShell` for every role (per the approved architecture
  decision), with a placeholder page per module (Members, Trainers, Attendance, Payments,
  Memberships, Meal Plans, Workout Plans, Sessions, Reports, Notifications, Notice Board,
  Settings) so the full navigation flow is demonstrable today.

## What's in Milestone 2

- **`features/dashboard`**: a full feature module (types, repository, service, hooks) following
  the same repository pattern as `features/auth` — `GET /api/v1/dashboard/{owner,trainer,member}`
  served by new MSW handlers (`mocks/handlers/dashboard.handlers.ts`, deterministic fixtures in
  `mocks/fixtures/dashboard.ts`).
- **Role-driven dashboard composition** (`getDashboardVariant()`): staff roles (super_admin,
  owner, manager, receptionist) get the Owner dashboard, trainers get the Trainer dashboard,
  members get the Member dashboard. This is deliberately role-based, not purely permission-based
  like the sidebar — the three dashboards are a named product requirement. Individual widgets
  *within* a variant still respect permission gates via `<RequirePermission>` (e.g. a
  receptionist on the Owner-variant dashboard won't see Trainer Performance, since they lack
  `trainers:read`).
- **Owner dashboard**: Revenue, Today's Attendance, Active/New Members, Membership Expiry,
  Pending Payments, Trainer Performance, Membership Distribution (pie), Revenue Trend (area
  chart), Peak Hours (bar chart), Recent Activity, Announcements, Quick Actions, Calendar,
  Notifications.
- **Trainer dashboard**: Today's Sessions, Upcoming Sessions, Assigned Members, Workout
  Progress, Meal Plans, Performance Metrics, Quick Actions, Notifications.
- **Member dashboard**: Membership Status, Workout Plan, Meal Plan compliance, Attendance
  History, Payments, Upcoming Sessions, Notifications, BMI, Goal Progress.
- **New reusable primitives**: `Progress` (design system), and `StatRow` / `ListWidgetCard` /
  `QuickActionsCard` / `GoalProgressCard` / chart widgets (feature-level composition — reused
  across all three dashboards instead of ~20 one-off widget files).
- **ESLint boundaries fix**: added a `feature-types` element (a feature's `types/**` only) so
  `mocks/fixtures/*` can depend on a feature's data *shape* without depending on its
  hooks/components/services — and fixed one deep cross-feature import from Milestone 1
  (`DashboardShell` now imports `useSession` from the `features/auth` barrel, not
  `features/auth/hooks` directly).

## Scope note

"Owner/Trainer/Member module" in Milestone 2 was interpreted as the three named dashboard
experiences from the brief's Owner/Trainer/Member Dashboard sections — not full CRUD screens for
Members/Trainers/Meal Plans/Workout Plans (those aren't explicitly assigned to a milestone in the
original plan; they remain placeholder pages until you want them scheduled).

## Not yet built (by design)

- Real feature data/repositories for Members/Trainers/Attendance/Payments/etc. — Milestones 3–4.
- PWA (manifest exists but icons/offline caching are Milestone 5).
- i18n (explicitly deferred per your approval).
- Vitest/Playwright test files (stack is pinned in `package.json`; test suites land alongside
  each feature starting Milestone 3, with a dedicated pass in Milestone 5).

## Next step

Milestone 3: Memberships, Attendance, Payments, Sessions.
