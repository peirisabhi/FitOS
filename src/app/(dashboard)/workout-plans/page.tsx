import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Workout Plans" };

export default function WorkoutPlansPage() {
  return (
    <PlaceholderPage
      title="Workout Plans"
      description="Build and assign training programs."
      milestone="Milestone 2"
      icon={ClipboardList}
    />
  );
}
