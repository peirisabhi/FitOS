import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

export interface PlaceholderPageProps {
  title: string;
  description?: string;
  milestone?: string;
  icon?: LucideIcon;
}

/**
 * Milestone 1 stand-in for modules whose real screens land in later
 * milestones (architecture doc §9). Proves navigation + permission
 * filtering end-to-end without a feature's repository/hooks existing yet.
 */
export function PlaceholderPage({ title, description, milestone = "an upcoming milestone", icon: Icon = Construction }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">This module ships in {milestone}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Navigation, permissions, and the page shell are already wired up — the repository, data, and UI for{" "}
          {title.toLowerCase()} land next.
        </p>
      </div>
    </div>
  );
}
