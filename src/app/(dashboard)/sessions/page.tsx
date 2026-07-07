import type { Metadata } from "next";
import { SessionsView } from "@/features/sessions";

export const metadata: Metadata = { title: "Sessions" };

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
        <p className="text-sm text-muted-foreground">Schedule and manage training sessions and classes.</p>
      </div>
      <SessionsView />
    </div>
  );
}
