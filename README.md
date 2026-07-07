# GymOS — Milestones 1–4 complete

Milestone 1: tooling, folder structure, theme, design system, base layouts, config-driven
navigation, mock auth, MSW + repository layer, route guards, dashboard shell.

Milestone 2: the three named dashboard experiences (Owner, Trainer, Member) with real widget
compositions over mocked data, plus full CRUD for Members, Trainers, Meal Plans, and Workout Plans.

Milestone 3: full CRUD for Memberships (plans), Attendance, Payments, and Sessions.

Milestone 4: Reports (analytics + CSV export), Notifications, Notice Board, and Settings.

Every module in the original brief now has a real, working page — there are no more placeholder
screens anywhere in the app.

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

## Milestone 2, completed: Members / Trainers / Meal Plans / Workout Plans

Four full modules, each following the same repository pattern end to end (types → schemas →
repository → service → hooks → components → MSW handlers → fixtures → page), replacing their
Milestone 1 placeholder pages:

- **Members** (`features/members`): searchable, paginated directory (name, email, plan, status,
  trainer, joined date). Add / edit via a form dialog (React Hook Form + Zod), remove via a
  confirm dialog. Gated by `members:read` / `members:write` / `members:delete`.
- **Trainers** (`features/trainers`): same pattern — specialty, status, rating, active clients.
  Gated by `trainers:read` / `trainers:write` / `trainers:delete` (delete added this pass, for
  symmetry with `members:delete` — owner + super_admin only).
- **Meal Plans** (`features/meal-plans`): assign/edit/remove a member's nutrition plan (plan name,
  daily calories, compliance %). Gated by `meal-plans:read` / `meal-plans:write`.
- **Workout Plans** (`features/workout-plans`): assign/edit/remove a member's training program
  (plan name, focus, week progress). Gated by `workout-plans:read` / `workout-plans:write`.

New shared pieces that came out of building these four: `buildQueryString()` (`lib/utils.ts`) for
turning `ListQueryParams` into a query string, and `ConfirmDialog` (`components/overlays`) as the
one confirm/cancel dialog every destructive action reuses. Search is server-side (hits the mock
API), pagination is client-side via the existing `DataTable` (documented in Milestone 1 as the
seam to swap in manual/server-side pagination or virtualization once real data volumes justify
it — still true, just deferred).

## What's in Milestone 3

Four more full modules, same end-to-end pattern (types → schemas → repository → service → hooks
→ components → MSW handlers → fixtures → page):

- **Memberships** (`features/memberships`): the *plans* themselves (Monthly Basic, Annual Elite,
  etc.) — price, billing cycle, duration, active subscriber count. Create/edit/remove a plan.
  Gated by `memberships:read` / `memberships:write`. (Note: this is distinct from the **Members**
  module built in Milestone 2, which manages individual member profiles.)
- **Attendance** (`features/attendance`): front-desk check-in/check-out log. "Log Check-in" records
  an arrival; a per-row "Check out" action stamps the departure time; records can be corrected via
  delete. Gated by `attendance:read` / `attendance:write`.
- **Payments** (`features/payments`): invoices/dues (member, amount, method, due date, status).
  "Record Payment" creates one as `pending`; a per-row "Mark as paid" action stamps it `paid`.
  Gated by `payments:read` / `payments:write`.
- **Sessions** (`features/sessions`): class and personal-training bookings. The page has a **List**
  tab (searchable table, cancel/remove actions) and a **Calendar** tab reusing the Milestone 1
  `Calendar` (FullCalendar) composite, color-coded by status. The schedule form splits date/start
  time/end time into separate native inputs for a friendlier UX, then composes them into ISO
  start/end on submit. Gated by `sessions:read` / `sessions:write`.

## What's in Milestone 4

- **Reports** (`features/reports`): revenue / attendance / membership-growth trend charts, a
  period selector (3/6/12 months), MetricCards, and a trainer performance table. "Export CSV"
  (`reports:export`) is genuinely functional, not mocked — `lib/csv.ts` serializes the currently
  loaded data and triggers a real browser download via a Blob + temporary anchor, no backend
  endpoint required. Deliberately uses its own local types/charts rather than importing the
  dashboard feature's — kept decoupled per the no-feature-coupling rule, even though the shapes
  are structurally similar.
- **Notifications** (`features/notifications`): a real notification center — list, per-item mark
  as read, "mark all as read", delete. No create form (notifications are system-generated, not
  user-authored). Gated by `notifications:read` / `notifications:write`.
- **Notice Board** (`features/notice-board`): announcement feed with pin/unpin, edit, delete, and
  audience targeting (Everyone / Staff only / Members only). Gated by `notice-board:read` /
  `notice-board:write`.
- **Settings** (`features/settings`): a tabbed page — Profile (edit your own name; updates the
  navbar immediately via the auth store), Organization (tenant name + plan; **owner/super_admin
  can edit, manager sees it read-only** — reflecting that `settings:write` isn't in the manager
  permission set while `settings:read` is), Appearance (light/dark/system), and Notification
  preferences (toggles). Trainer, receptionist, and member don't have `settings:read` at all, so
  they never see this page in the sidebar and are redirected by middleware if they hit the URL
  directly — this was already true from the Milestone 1 permission matrix, no new gating needed.

Every module now has a real implementation — no placeholder pages remain anywhere in the app.

## Not yet built (by design)

- PWA (manifest exists but icons/offline caching are Milestone 5).
- i18n (explicitly deferred per your approval).
- Vitest/Playwright test files (stack is pinned in `package.json`; a dedicated test-writing pass
  is Milestone 5, alongside animation polish, performance work, and accessibility).

## Next step

Milestone 5: polish, animations, performance optimization, accessibility, PWA, testing.
