"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { hasPermission } from "@/lib/permissions";
import type { Permission } from "@/types/permission.types";

/**
 * Fine-grained, UI-level permission check — the client-side half of the
 * two-tier guard model (middleware handles route-level; this handles
 * button/section/widget-level). Both read from the same
 * `resolvePermissions()` function, so there's exactly one place
 * permission logic lives (architecture doc §4).
 */
export function usePermission() {
  const permissions = useAuthStore((s) => s.permissions);

  const can = useMemo(
    () =>
      (required: Permission | Permission[]): boolean =>
        hasPermission(permissions, required),
    [permissions],
  );

  return { can, permissions };
}
