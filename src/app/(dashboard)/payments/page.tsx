import type { Metadata } from "next";
import { PaymentsTable } from "@/features/payments";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Track invoices, dues, and payment history.</p>
      </div>
      <PaymentsTable />
    </div>
  );
}
