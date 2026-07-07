import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  /** Positive = up, negative = down, undefined = no trend shown. */
  trend?: number;
  trendLabel?: string;
  className?: string;
}

/** Single-number KPI card — Revenue, Active Members, Today's Attendance, etc. */
export function MetricCard({ label, value, icon: Icon, trend, trendLabel, className }: MetricCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              <span>{Math.abs(trend)}%</span>
              {trendLabel && <span className="font-normal text-muted-foreground">{trendLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
