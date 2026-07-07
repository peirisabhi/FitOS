import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Manage your account, gym, and tenant configuration."
      milestone="Milestone 4"
      icon={Settings}
    />
  );
}
