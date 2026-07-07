import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Sessions" };

export default function SessionsPage() {
  return (
    <PlaceholderPage
      title="Sessions"
      description="Schedule and manage training sessions and classes."
      milestone="Milestone 3"
      icon={CalendarClock}
    />
  );
}
