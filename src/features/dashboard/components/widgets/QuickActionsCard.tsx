"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "@/components/data-display";
import { usePermission } from "@/hooks/usePermission";
import type { Permission } from "@/types/permission.types";

export interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermissions: Permission[];
}

/** Permission-filtered grid of shortcut buttons — same filtering pattern as the sidebar (config-driven, not role-hardcoded). */
export function QuickActionsCard({ actions }: { actions: QuickAction[] }) {
  const { can } = usePermission();
  const visible = actions.filter((action) => can(action.requiredPermissions));

  if (visible.length === 0) return null;

  return (
    <DashboardCard title="Quick Actions">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {visible.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors hover:bg-muted"
          >
            <action.icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
