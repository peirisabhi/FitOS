"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  events: EventInput[];
  onEventClick?: (arg: EventClickArg) => void;
  onDateSelect?: (arg: DateSelectArg) => void;
  initialView?: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  className?: string;
}

/**
 * FullCalendar wrapper — the one place calendar chrome/theming is
 * configured. Sessions, Attendance, and future scheduling screens
 * (Milestone 3) render through this, never a raw <FullCalendar />.
 */
export function Calendar({ events, onEventClick, onDateSelect, initialView = "dayGridMonth", className }: CalendarProps) {
  return (
    <div className={cn("gymos-calendar rounded-lg border p-2", className)}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        events={events}
        selectable={Boolean(onDateSelect)}
        select={onDateSelect}
        eventClick={onEventClick}
        height="auto"
        dayMaxEvents={3}
      />
    </div>
  );
}
