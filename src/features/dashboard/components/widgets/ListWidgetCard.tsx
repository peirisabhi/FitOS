import type { ReactNode } from "react";
import { DashboardCard } from "@/components/data-display";
import { EmptyState } from "@/components/feedback";

export interface ListWidgetCardProps<T> {
  title: string;
  description?: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
  actions?: ReactNode;
  getKey: (item: T) => string;
}

/** DashboardCard + a divided list of StatRow-shaped items, with a built-in empty state. */
export function ListWidgetCard<T>({
  title,
  description,
  items,
  renderItem,
  emptyMessage = "Nothing to show right now.",
  actions,
  getKey,
}: ListWidgetCardProps<T>) {
  return (
    <DashboardCard title={title} description={description} actions={actions}>
      {items.length === 0 ? (
        <EmptyState title={emptyMessage} className="border-none p-0" />
      ) : (
        <div className="divide-y">
          {items.map((item) => (
            <div key={getKey(item)}>{renderItem(item)}</div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
