import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface DashboardCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Generic "widget shell" every dashboard widget (chart, list, calendar) renders inside. */
export function DashboardCard({ title, description, actions, children, className }: DashboardCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
    </Card>
  );
}
