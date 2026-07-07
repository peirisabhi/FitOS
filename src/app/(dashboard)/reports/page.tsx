import type { Metadata } from "next";
import { ReportsView } from "@/features/reports";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Analyze revenue, attendance, and growth trends.</p>
      </div>
      <ReportsView />
    </div>
  );
}
