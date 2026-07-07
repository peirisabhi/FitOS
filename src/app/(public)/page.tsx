import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Root route. Middleware already guarantees anyone reaching this page is
 * authenticated (unauthenticated requests are redirected to /login before
 * this ever renders) — so this is just the entry point into the dashboard.
 */
export default function RootPage() {
  redirect(ROUTES.dashboard);
}
