import { authHandlers } from "@/mocks/handlers/auth.handlers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard.handlers";

/**
 * Aggregate handler list. As each feature module gets a real repository
 * (Milestone 2+), its handlers file (e.g. `members.handlers.ts`) is added
 * here — the feature's repository never imports MSW directly, only this
 * module composition does.
 */
export const handlers = [...authHandlers, ...dashboardHandlers];
