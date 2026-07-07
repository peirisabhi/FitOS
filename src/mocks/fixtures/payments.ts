import type { Payment } from "@/features/payments/types";

const ENTRIES: Array<[string, string, number, Payment["method"], Payment["status"], number]> = [
  ["Jordan Blake", "Annual Elite renewal", 899, "card", "paid", -120],
  ["Sarah Chen", "Monthly Plus", 79, "card", "paid", -10],
  ["Ravi Kumar", "Quarterly renewal", 199, "bank-transfer", "pending", 2],
  ["Lucy Grant", "Monthly Basic", 49, "cash", "pending", 4],
  ["Ahmed Farouk", "Personal training add-on", 120, "card", "overdue", -3],
  ["Marcus Webb", "Monthly Plus", 79, "card", "overdue", -6],
  ["Elena Ruiz", "Day Pass", 15, "cash", "paid", -1],
  ["Priya Nair", "Annual Elite renewal", 899, "bank-transfer", "refunded", -45],
];

function seedDate(daysOffset: number): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
}

export const MOCK_PAYMENTS: Payment[] = ENTRIES.map(([memberName, description, amount, method, status, dueOffset], i) => ({
  id: `pay_${i + 1}`,
  memberName,
  description,
  amount,
  method,
  status,
  dueOn: seedDate(dueOffset),
  paidOn: status === "paid" || status === "refunded" ? seedDate(dueOffset - 1) : undefined,
}));
