import type { Metadata } from "next";
import { NotificationsList } from "@/features/notifications";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">Review system and member notifications.</p>
      </div>
      <NotificationsList />
    </div>
  );
}
