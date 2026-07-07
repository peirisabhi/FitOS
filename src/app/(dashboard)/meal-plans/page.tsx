import type { Metadata } from "next";
import { UtensilsCrossed } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Meal Plans" };

export default function MealPlansPage() {
  return (
    <PlaceholderPage
      title="Meal Plans"
      description="Assign and track nutrition plans."
      milestone="Milestone 2"
      icon={UtensilsCrossed}
    />
  );
}
