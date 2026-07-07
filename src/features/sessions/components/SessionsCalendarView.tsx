"use client";

import { useMemo } from "react";
import type { EventClickArg } from "@fullcalendar/core";
import { toast } from "sonner";
import { Calendar } from "@/components/data-display";
import { useSessions } from "@/features/sessions/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback";

const STATUS_COLOR: Record<string, string> = {
  scheduled: "var(--color-primary)",
  completed: "oklch(0.708 0 0)",
  cancelled: "oklch(0.577 0.245 27.325)",
};

export function SessionsCalendarView() {
  const { data, isLoading, isError, refetch } = useSessions({ pageSize: 500 });

  const events = useMemo(
    () =>
      (data?.items ?? []).map((session) => ({
        id: session.id,
        title: session.memberName ? `${session.title} — ${session.memberName}` : session.title,
        start: session.start,
        end: session.end,
        backgroundColor: STATUS_COLOR[session.status],
        borderColor: STATUS_COLOR[session.status],
      })),
    [data],
  );

  if (isLoading) return <Skeleton className="h-[600px] w-full rounded-lg" />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <Calendar
      events={events}
      initialView="timeGridWeek"
      onEventClick={(arg: EventClickArg) => toast.info(arg.event.title)}
    />
  );
}
