import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/config/site.config";
import { NAVIGATION } from "@/config/navigation.config";
import { ROUTES } from "@/constants/routes";
import { resolvePermissions, hasPermission } from "@/lib/permissions";
import { decodeMockToken } from "@/mocks/token";

/**
 * Tier 1 of the two-tier guard model (architecture doc §4). Coarse,
 * SSR-safe, route-level only: no session -> login, session but wrong
 * permission for this route -> 403. Fine-grained UI-level checks are
 * `usePermission()` / `<RequirePermission>` on the client (tier 2) — both
 * tiers call `resolvePermissions()`, so there is exactly one place
 * permission logic lives.
 */
const AUTH_PATHS = [ROUTES.login, ROUTES.forgotPassword, ROUTES.resetPassword];

function findRequiredPermissions(pathname: string) {
  for (const section of NAVIGATION) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.requiredPermissions;
      }
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(siteConfig.session.cookieName)?.value;
  const payload = decodeMockToken(token);

  const isAuthPath = AUTH_PATHS.some((path) => pathname === path);

  if (!payload) {
    if (isAuthPath || pathname === ROUTES.forbidden) {
      return NextResponse.next();
    }
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated — bounce away from login/forgot/reset.
  if (isAuthPath) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  const required = findRequiredPermissions(pathname);
  if (required) {
    const granted = resolvePermissions(payload.roles);
    if (!hasPermission(granted, required)) {
      return NextResponse.redirect(new URL(ROUTES.forbidden, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next internals)
     * - favicon, manifest, icons, mockServiceWorker.js (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|mockServiceWorker.js|icons).*)",
  ],
};
