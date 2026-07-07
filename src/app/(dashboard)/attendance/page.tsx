import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return (
    <PlaceholderPage
      title="Attendance"
      description="Track check-ins across members and classes."
      milestone="Milestone 3"
      icon={CalendarCheck}
    />
  );
}
