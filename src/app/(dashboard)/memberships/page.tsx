import type { Metadata } from "next";
import { MembershipPlansTable } from "@/features/memberships";

export const metadata: Metadata = { title: "Memberships" };

export default function MembershipsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Memberships</h1>
        <p className="text-sm text-muted-foreground">Configure plans, pricing, and renewal terms.</p>
      </div>
      <MembershipPlansTable />
    </div>
  );
}
