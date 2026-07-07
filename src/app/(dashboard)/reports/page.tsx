import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Analyze revenue, attendance, and growth trends."
      milestone="Milestone 4"
      icon={BarChart3}
    />
  );
}
