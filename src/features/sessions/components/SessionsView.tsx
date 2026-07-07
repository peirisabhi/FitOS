"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionsTable } from "@/features/sessions/components/SessionsTable";
import { SessionsCalendarView } from "@/features/sessions/components/SessionsCalendarView";

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
