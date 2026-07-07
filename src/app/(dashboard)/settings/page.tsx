import type { Metadata } from "next";
import { SettingsView } from "@/features/settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, gym, and preferences.</p>
      </div>
      <SettingsView />
    </div>
  );
}
