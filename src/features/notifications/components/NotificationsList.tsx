"use client";

import { memo } from "react";
import { Bell, CreditCard, BadgeCheck, CalendarClock, CheckCheck, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QueryBoundary } from "@/components/feedback";
import { RequirePermission } from "@/shared/components";
import { usePermission } from "@/hooks/usePermission";
import { useNotifications } from "@/features/notifications/hooks";
import {
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@/features/notifications/hooks";
import type { Notification, NotificationCategory } from "@/features/notifications/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<NotificationCategory, LucideIcon> = {
  system: Bell,
  billing: CreditCard,
  membership: BadgeCheck,
  session: CalendarClock,
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Memoized so marking one notification read (which updates the shared
 * query-cache array) doesn't re-render every other row in the list —
 * each row only re-renders when its own `notification` object changes.
 */
const NotificationRow = memo(function NotificationRow({
  notification,
}: {
  notification: Notification;
}) {
  const { can } = usePermission();
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const Icon = CATEGORY_ICON[notification.category];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors",
        !notification.read && "bg-primary/5 border-primary/20",
      )}
    >
      <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{notification.title}</p>
          {!notification.read && <Badge variant="secondary">New</Badge>}
        </div>
        <p className="text-muted-foreground text-sm">{notification.message}</p>
        <p className="text-muted-foreground mt-1 text-xs">{timeAgo(notification.createdAt)}</p>
      </div>
      {can("notifications:write") && (
        <div className="flex shrink-0 gap-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Mark as read"
              onClick={() => markRead.mutate(notification.id)}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            onClick={() => deleteNotification.mutate(notification.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});

export function NotificationsList() {
  const { data, isLoading, isError, refetch } = useNotifications({ pageSize: 100 });
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = data?.items.filter((n) => !n.read).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        </p>
        <RequirePermission permission="notifications:write">
          <Button
            variant="outline"
            size="sm"
            disabled={unreadCount === 0}
            onClick={() => markAllRead.mutate()}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </RequirePermission>
      </div>

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        data={data}
        onRetry={() => refetch()}
        isEmpty={(d) => d.items.length === 0}
        errorTitle="Couldn't load notifications"
        loadingFallback={
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted/40 h-20 animate-pulse rounded-lg border" />
            ))}
          </div>
        }
      >
        {(result) => (
          <div className="space-y-3">
            {result.items.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </QueryBoundary>
    </div>
  );
}
