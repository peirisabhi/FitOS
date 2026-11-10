"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionsTable } from "@/features/sessions/components/SessionsTable";

/**
 * FullCalendar is a heavy dependency — only load it once the user actually
 * clicks the Calendar tab, not on every visit to /sessions (most visits
 * likely just want the list). See architecture doc §"Performance".
 */
const SessionsCalendarView = dynamic(
  () =>
    import("@/features/sessions/components/SessionsCalendarView").then(
      (m) => m.SessionsCalendarView,
    ),
  { loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />, ssr: false },
);

export function SessionsView() {
  return (
    <Tabs defaultValue="list">
      <TabsList>
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>
      <TabsContent value="list" className="mt-4">
        <SessionsTable />
      </TabsContent>
      <TabsContent value="calendar" className="mt-4">
        <SessionsCalendarView />
      </TabsContent>
    </Tabs>
  );
}
