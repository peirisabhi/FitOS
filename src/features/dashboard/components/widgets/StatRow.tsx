import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatRowProps {
  title: string;
  subtitle?: string;
  /** Rendered on the right — a badge, amount, or progress snippet. */
  trailing?: ReactNode;
  className?: string;
}

/**
 * The single row primitive every dashboard "list style" widget renders
 * (Membership Expiry, Pending Payments, Trainer Performance, Recent
 * Activity's non-timeline variants, Assigned Members, Meal Plans,
 * Payments…). One implementation instead of a bespoke row per widget.
 */
export function StatRow({ title, subtitle, trailing, className }: StatRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0 text-right">{trailing}</div>}
    </div>
  );
}
