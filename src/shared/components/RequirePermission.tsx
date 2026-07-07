"use client";

import type { ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";
import { PermissionDenied } from "@/components/feedback/PermissionDenied";
import type { Permission } from "@/types/permission.types";

export interface RequirePermissionProps {
  permission: Permission | Permission[];
  children: ReactNode;
  /** Render nothing instead of a full PermissionDenied page — for inline UI (buttons, sections). */
  fallback?: ReactNode;
}

/**
 * UI-level half of the two-tier guard model (architecture doc §4/§8).
 * Middleware handles route-level redirects; this hides/replaces content
 * within a page a user has partial access to (e.g. an owner-only "Delete"
 * button on a page a manager can otherwise view).
 */
export function RequirePermission({ permission, children, fallback = null }: RequirePermissionProps) {
  const { can } = usePermission();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/** Whole-page variant — renders the full PermissionDenied state, not just `fallback`. */
export function RequirePermissionPage({ permission, children }: Omit<RequirePermissionProps, "fallback">) {
  const { can } = usePermission();

  if (!can(permission)) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
}
