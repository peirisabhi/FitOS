import type { Metadata } from "next";
import { Dumbbell } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Trainers" };

export default function TrainersPage() {
  return (
    <PlaceholderPage
      title="Trainers"
      description="Manage trainer profiles, specialties, and assignments."
      milestone="Milestone 2"
      icon={Dumbbell}
    />
  );
}
