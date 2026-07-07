# GymOS — Frontend Architecture Document (v1)

Status: **Proposal — awaiting approval before implementation begins.**

---

## 1. Architectural Analysis: Deviations From the Brief, and Why

Before touching folder structures, ten decisions need to be made explicitly. Each one below either sharpens something the brief left implicit, or proposes a deviation. None of these change the tech stack — they change *how* it's wired together.

**1.1 Mocking must happen at the network layer, not the function layer.**
The brief says mocks will later be "replaced by a NestJS REST API without changing UI components." That guarantee only holds if the repository layer always speaks HTTP. If a mock repository just calls a local JS function that returns fake data, swapping it for a real API means rewriting every repository — the exact coupling we're trying to avoid. Instead: MSW intercepts real `fetch`/`axios` calls against a versioned base path (`/api/v1/members`, etc.). Repositories are written once, against that HTTP contract, from day one. Going live later means pointing `NEXT_PUBLIC_API_BASE_URL` at NestJS and turning MSW off — zero repository code changes.

**1.2 Zustand and TanStack Query must never hold the same data.**
Server data (members, payments, sessions) lives only in TanStack Query's cache. Zustand is reserved for genuine client state: sidebar collapsed, active tenant context, command-palette open, theme, in-progress wizard form state. Mixing the two is the single most common cause of stale-data bugs in dashboards this size — one becomes the source of truth, the other silently drifts.

**1.3 Menus, roles, and permissions are data, not JSX.**
A `navigation.config.ts` and `permissions.config.ts` are the only place role/menu knowledge lives. Sidebars, route guards, and `<Can>` checks all read from the same resolved permission set — never three separate hand-maintained lists that quietly diverge over a few years of feature work.

**1.4 One dashboard shell, not five duplicated layouts.**
The brief lists Owner/Trainer/Member/Manager/Receptionist layouts. Built as five separate `layout.tsx` trees, this duplicates chrome (topbar, sidebar shell, notification tray, command palette) five times and guarantees drift the first time someone fixes a bug in one and forgets the other four. Proposal: **one `DashboardShell`**, parameterized by the resolved role's navigation config and dashboard widget composition. "Layout per role" becomes *composition* per role (which widgets, which nav items), not *duplication* of chrome. If you have a specific reason to want physically separate layout trees (e.g. wildly different visual identity per role), say so and we'll split it — flagging this as a decision point, not assuming it.

**1.5 Feature isolation needs an enforcement mechanism, not just a convention.**
"No feature coupling" as a rule everyone agrees to in month one is a rule nobody follows by month eighteen. Each feature exports one public surface via `index.ts`; `eslint-plugin-boundaries` (or `import/no-restricted-paths`) is configured so `features/payments` physically cannot deep-import `features/members/components/MemberRow`. This is a lint error, not a code review nitpick.

**1.6 Zod schemas are the single source of truth for a shape, not TypeScript interfaces written twice.**
Every entity (Member, Payment, Session…) gets one `z.object` in `features/*/schemas`. The TS type is `z.infer<typeof schema>`. That schema validates forms (React Hook Form resolver), validates mock API responses at the repository boundary, and later validates real API responses the same way — one definition, three uses, impossible to let drift.

**1.7 Loading / error / empty states are a wrapper, not a per-page copy-paste.**
A `<QueryBoundary>` component takes a `useQuery` result and renders the shared Skeleton, Error State, or Empty State components automatically, only rendering `children` on success. Every list/table page uses it. This is what actually makes "Loading Skeleton, Empty State, Error State" reusable rather than aspirational.

**1.8 Multi-tenancy is a first-class concept from day one, even mocked.**
"Multi-tenant SaaS platform" is in the product description, but no tenant model is specified. Recommendation: bake `tenantId` into the session/user model and into every repository query signature now (even though the mock only ever has one tenant). Retrofitting tenant scoping after 40 screens are built is far more expensive than carrying an unused parameter for a few milestones.

**1.9 Testing tooling isn't specified but is a Milestone 5 deliverable.**
Recommend **Vitest + React Testing Library** for unit/component tests and **Playwright** for e2e/auth-flow tests, since both integrate cleanly with the rest of the stack and Next.js 15. Flagging as a recommendation, not yet adopted — confirm before Milestone 5.

**1.10 Open questions, not decided unilaterally:**
- i18n: no requirement stated. Scaffolding `next-intl` now costs little; retrofitting later touches every string. Want it in Milestone 1 as plumbing-only (English fallback), or skip entirely?
- Real NestJS timeline: does a contract/OpenAPI spec exist yet, or should repository interfaces be treated as the contract until then?

---

## 2. Folder Structure

```
gymos/
├── public/
│   ├── manifest.json
│   ├── icons/                      # PWA icons, splash screens
│   └── offline.html
├── src/
│   ├── app/                        # Next.js App Router — routing ONLY, no business logic
│   │   ├── (public)/                # marketing/landing, if any
│   │   ├── (auth)/                  # login, forgot-password, reset-password
│   │   │   ├── login/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/             # authenticated shell, one DashboardShell layout
│   │   │   ├── layout.tsx           # renders DashboardShell, resolves role/permissions
│   │   │   ├── dashboard/page.tsx   # role-aware landing (composes widgets by permission)
│   │   │   ├── members/…
│   │   │   ├── trainers/…
│   │   │   ├── attendance/…
│   │   │   ├── payments/…
│   │   │   ├── memberships/…
│   │   │   ├── meal-plans/…
│   │   │   ├── workout-plans/…
│   │   │   ├── sessions/…
│   │   │   ├── reports/…
│   │   │   ├── notifications/…
│   │   │   ├── notice-board/…
│   │   │   └── settings/…
│   │   ├── error.tsx / not-found.tsx / global-error.tsx
│   │   ├── layout.tsx               # root: providers, fonts, theme
│   │   └── middleware.ts            # session check, route-level RBAC guard
│   │
│   ├── components/                  # DESIGN SYSTEM — zero business logic
│   │   ├── ui/                      # shadcn/ui primitives (Button, Input, Dialog, …)
│   │   ├── data-display/             # DataTable, MetricCard, DashboardCard, ChartCard, Timeline
│   │   ├── feedback/                 # Toast, EmptyState, ErrorState, PermissionDenied, 404, 500, Maintenance, Skeletons
│   │   ├── navigation/                # Sidebar, Navbar, Breadcrumb, Tabs, Pagination
│   │   └── overlays/                  # Modal, Drawer, Dialog wrappers, Combobox, Search
│   │
│   ├── features/                    # FEATURE MODULES — one folder per business domain
│   │   ├── auth/
│   │   ├── members/
│   │   ├── trainers/
│   │   ├── attendance/
│   │   ├── payments/
│   │   ├── memberships/
│   │   ├── meal-plans/
│   │   ├── workout-plans/
│   │   ├── sessions/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── notice-board/
│   │   └── settings/
│   │       # each feature contains:
│   │       # components/  hooks/  repository/  services/  schemas/  constants/  types/  utils/  index.ts
│   │
│   ├── shared/                      # cross-feature, non-pure-UI reusable logic
│   │   ├── components/               # ProfileCard, EntityAvatarStack — compositions used by 2+ features
│   │   ├── hooks/                     # useDebouncedValue, useOptimisticMutation, useMediaQuery
│   │   └── utils/
│   │
│   ├── layouts/                      # DashboardShell, AuthLayout, PublicLayout, ErrorLayout
│   ├── providers/                    # QueryClientProvider, ThemeProvider, AuthProvider, ToastProvider
│   ├── store/                        # Zustand slices: ui.store.ts, auth.store.ts, tenant.store.ts
│   ├── repositories/                  # base repository interfaces, HTTP client instance, repository factory (mock|rest switch)
│   ├── services/                      # cross-feature services only (rare — most services live inside features)
│   ├── hooks/                         # truly global hooks (useAuth, usePermission, useTheme)
│   ├── types/                        # global types (Role, Permission, ApiResponse<T>, Tenant)
│   ├── constants/                     # ROUTES, QUERY_KEYS, STORAGE_KEYS
│   ├── config/                        # navigation.config.ts, permissions.config.ts, roles.config.ts, site.config.ts
│   ├── mocks/                         # MSW setup: browser.ts, server.ts, handlers/ (per feature), fixtures/
│   ├── lib/                           # http client, date/fns wrappers, zod resolvers, cn()
│   └── assets/
├── eslint.config.js                  # includes boundaries plugin rules
├── .husky/
└── package.json
```

### Naming discipline (prevents ambiguity over years of maintenance)
- `components/` = **pure design system**. No API calls, no feature imports, no business logic. Could be published as a standalone package.
- `shared/` = reusable pieces with *some* business awareness that are used by 2+ features (not pure UI, not feature-specific).
- `features/*/components` = composed, feature-specific UI (e.g., `MemberDetailCard` — knows about a Member).

---

## 3. Dependency Graph & Layering Rules

```
app/  ───────────────▶  layouts/, providers/, features/*/index.ts   (routing glue only)
layouts/  ───────────▶  components/, shared/, config/, hooks/
features/X  ─────────▶  components/, shared/, lib/, types/, constants/, config/
features/X/components ─▶ features/X/hooks ─▶ features/X/services ─▶ features/X/repository ─▶ lib/http-client
                                                                                    ▼
                                                                        mocks/ (MSW, dev)  OR  NestJS (prod)

components/  ────────▶  (nothing feature-specific; may use lib/, types/)
shared/     ─────────▶  components/, lib/, types/
```

**Hard rules, enforced by ESLint boundaries:**
1. `features/*` may never import from another `features/*` directly — only via that feature's `index.ts` barrel, and only if there's a legitimate cross-feature need (rare; prefer composing at the page level instead).
2. `components/` never imports from `features/*` or `store/` — it must stay swappable/extractable.
3. Only `repositories/` and `features/*/repository` may import the HTTP client. Services/hooks/components never call `fetch` directly.
4. Only `features/*/repository` files import from `mocks/` (and only in non-production builds).

---

## 4. Routing Strategy

Next.js 15 App Router, route groups by access level rather than by role (roles differ by *navigation config*, not by *route tree*):

```
/                          → (public) marketing or redirect to /login
/login, /forgot-password, /reset-password   → (auth) layout, unauthenticated only
/dashboard                 → (dashboard) layout — DashboardShell, role-aware widget composition
/members, /trainers, /attendance, /payments,
/memberships, /meal-plans, /workout-plans,
/sessions, /reports, /notifications,
/notice-board, /settings   → (dashboard), each guarded by required permission(s)
```

**Two-tier guard model:**
- **Middleware (`middleware.ts`)** — coarse, SSR-safe. Reads a mock session cookie (signed, includes role claims + expiry). No session → redirect to `/login?next=…`. Session present but expired → clear + redirect. Authenticated but zero permission on the whole route → redirect to `/403`.
- **Client-side (`<RequirePermission>` + `usePermission()`)** — fine-grained, per button/section/widget. Same `resolvePermissions()` function backs both tiers, so there is exactly one place permission logic lives.

Session expiration: token `exp` checked on an interval + on window focus; on expiry, user sees a toast, is redirected to `/login`, and post-login returns to the page they were on.

---

## 5. Design System

**Tokens:** CSS variables (`--radius`, `--spacing-*`, `--color-*`) driving Tailwind v4 theme, light/dark/system via `next-themes`. One consistent border-radius scale, one spacing scale — no ad hoc values in components.

**Primitives** (`components/ui`, shadcn/ui + Radix): Button, Input, Select, Combobox, Checkbox, Switch, Tabs, Dialog, Sheet (Drawer), Popover, Tooltip, Avatar, Badge, Card, Separator, Skeleton.

**Composite components** (`components/data-display`, `components/navigation`, `components/overlays`, `components/feedback`): DataTable (TanStack Table + virtualization for large lists), MetricCard, DashboardCard, ChartCard (Recharts wrapper), Calendar (FullCalendar wrapper), Timeline, Sidebar (config-driven), Navbar, Breadcrumb (route-driven), Pagination, ProfileCard, EmptyState, ErrorState, PermissionDenied, 404, 500, Maintenance page, Loading Skeletons (per data-shape: table skeleton, card skeleton, list skeleton).

Every composite component is built once here and consumed everywhere — a features folder never redefines a table or a card.

---

## 6. State Management Strategy

| Concern | Tool | Notes |
|---|---|---|
| Server data (members, payments, sessions, reports…) | TanStack Query | cache key convention: `constants/query-keys.ts`, one factory per feature |
| Forms | React Hook Form + Zod resolver | schema lives in feature, shared between form and API validation |
| Auth session snapshot (user, roles, permissions) | Zustand (`auth.store`) | hydrated from cookie/session on load, not source of truth for server data |
| UI state (sidebar collapsed, command palette, modal stack, active tenant) | Zustand (`ui.store`, `tenant.store`) | never persisted server data here |
| Theme | next-themes | not Zustand — avoids re-render storms |
| Optimistic updates | TanStack Query mutations + shared `useOptimisticMutation` wrapper | standardized rollback-on-error pattern |

No Context API for global state (per brief) — Context is reserved for narrow, local composition (e.g., a `Tabs` primitive's internal state), never cross-cutting app state.

---

## 7. Repository Pattern

```
UI Component
   ↓ (calls a hook)
useMembers() / useCreateMember()          [features/members/hooks]
   ↓ (calls a service)
memberService.list() / memberService.create()   [features/members/services]
   ↓ (calls a repository, typed by interface)
memberRepository.findAll() / .create()    [features/members/repository]
   ↓ (HTTP call to /api/v1/members)
lib/http-client  →  MSW (dev/mock) intercepts  →  fixtures/handlers
                 →  NestJS (prod) — same URL contract, MSW simply turned off
```

- Every repository implements an interface (`IMemberRepository`) defined once in `features/members/types`.
- Services depend on the interface, not the implementation — swapping mock↔real never touches a service or hook.
- Switch mechanism: `NEXT_PUBLIC_API_MODE=mock|rest` env var gates whether `mocks/browser.ts` starts the MSW worker; the repository code itself never branches on this — it's purely an infra-level toggle.
- Zod validates the response shape at the repository boundary before it reaches the service layer — a malformed mock fixture or a misbehaving real endpoint fails loudly and early, not deep inside a component.

---

## 8. Permission System (RBAC + PBAC)

**Roles:** `super_admin`, `owner`, `manager`, `trainer`, `receptionist`, `member` — defined once in `config/roles.config.ts`.

**Permissions:** granular strings, e.g. `members:read`, `members:write`, `payments:read`, `reports:export` — defined in `config/permissions.config.ts`, grouped by module.

**Role → permission matrix:** a single object mapping each role to its permission set. Users may hold multiple roles (`user.roles: Role[]`); `resolvePermissions(roles)` returns the **union** of each role's permissions, memoized in `auth.store`.

**Navigation:** `config/navigation.config.ts` — each entry declares `{ label, href, icon, requiredPermission, featureFlag? }`. The Sidebar component filters this array against the resolved permission set at render time. No menu is ever hand-written per role.

**Guarding, two tiers** (as in §4): middleware for route-level, `<RequirePermission permission="members:write">` / `usePermission()` for UI-level (hide/disable a button, a whole widget, a whole page section).

**Mock users** (seeded in `mocks/fixtures/users.ts`, matching the six provided):

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@gymos.com | Admin@123 |
| Owner | owner@gymos.com | Owner@123 |
| Manager | manager@gymos.com | Manager@123 |
| Trainer | trainer@gymos.com | Trainer@123 |
| Receptionist | reception@gymos.com | Reception@123 |
| Member | member@gymos.com | Member@123 |

---

## 9. Milestone Plan (confirmed, unchanged from brief)

1. **Foundation** — project init, tooling, folder structure, theme, design system primitives, base layouts, config-driven navigation, mock auth, MSW + repository layer, route guards, dashboard shell.
2. **Core modules** — Owner / Trainer / Member modules, dashboard widgets per role.
3. **Operations** — Memberships, Attendance, Payments, Sessions.
4. **Back office** — Reports, Notifications, Settings, Notice Board.
5. **Polish** — animation pass, performance (virtualization, code-splitting, memoization), accessibility audit, PWA, testing.

Each milestone ships independently reviewable; no milestone starts until the previous is approved.

---

## Approval Gate — Decisions Confirmed

1. §1.4 — **One shared `DashboardShell`**, role-aware nav/widget composition via config. Confirmed.
2. §1.10 — **i18n skipped for now.** Revisit if multi-language becomes a real requirement.
3. §1.9 — **Vitest + React Testing Library + Playwright** confirmed as the testing stack (applied in Milestone 5).

Architecture approved. Milestone 1 implementation begins next.
