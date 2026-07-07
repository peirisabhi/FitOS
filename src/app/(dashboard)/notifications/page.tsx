import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <PlaceholderPage
      title="Notifications"
      description="Review system and member notifications."
      milestone="Milestone 4"
      icon={Bell}
    />
  );
}
