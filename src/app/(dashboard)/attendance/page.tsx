import type { Metadata } from "next";
import { AttendanceTable } from "@/features/attendance";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">Track check-ins across members and classes.</p>
      </div>
      <AttendanceTable />
    </div>
  );
}
