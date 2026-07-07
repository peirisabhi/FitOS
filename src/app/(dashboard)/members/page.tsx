import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage() {
  return (
    <PlaceholderPage
      title="Members"
      description="Manage member profiles, plans, and history."
      milestone="Milestone 2"
      icon={Users}
    />
  );
}
