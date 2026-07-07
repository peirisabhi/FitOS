import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/types/permission.types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** User needs at least one of these permissions to see this item. */
  requiredPermissions: Permission[];
  /** Optional feature flag key; item is hidden if the flag resolves false. */
  featureFlag?: string;
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
