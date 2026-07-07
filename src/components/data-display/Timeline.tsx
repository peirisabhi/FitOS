import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: LucideIcon;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/** Vertical activity feed — used for "Recent Activity" style widgets. */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("space-y-6", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={item.id} className="relative flex gap-3">
            {index !== items.length - 1 && (
              <span className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-border" aria-hidden />
            )}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : <span className="h-2 w-2 rounded-full bg-primary" />}
            </div>
            <div className="flex-1 space-y-0.5 pb-1">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
