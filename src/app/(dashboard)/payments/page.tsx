import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <PlaceholderPage
      title="Payments"
      description="Track invoices, dues, and payment history."
      milestone="Milestone 3"
      icon={CreditCard}
    />
  );
}
