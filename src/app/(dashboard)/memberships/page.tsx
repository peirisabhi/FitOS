import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Memberships" };

export default function MembershipsPage() {
  return (
    <PlaceholderPage
      title="Memberships"
      description="Configure plans, pricing, and renewal rules."
      milestone="Milestone 3"
      icon={BadgeCheck}
    />
  );
}
