import type { Metadata } from "next";
import { MembersTable } from "@/features/members";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        <p className="text-sm text-muted-foreground">Manage member profiles, plans, and trainer assignments.</p>
      </div>
      <MembersTable />
    </div>
  );
}
