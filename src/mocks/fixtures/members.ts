import type { Member } from "@/features/members/types";

const FIRST_NAMES = [
  "Sarah", "Marcus", "Elena", "Tom", "Ravi", "Lucy", "Ahmed", "Nina", "Chris", "Priya",
  "Jordan", "Hannah", "Diego", "Ava", "Leo", "Maya", "Noah", "Zara", "Ivan", "Grace",
];
const LAST_NAMES = [
  "Chen", "Webb", "Ruiz", "Baker", "Kumar", "Grant", "Farouk", "Patel", "Doyle", "Nair",
  "Blake", "Lee", "Alvarez", "Brooks", "Kim", "Singh", "Novak", "Khan", "Petrov", "Adams",
];
const PLANS = ["Monthly Basic", "Monthly Plus", "Quarterly", "Annual Elite", "Day Pass"];
const STATUSES: Member["status"][] = ["active", "active", "active", "expiring", "expired", "frozen"];
const TRAINERS = ["Diego Alvarez", "Nina Patel", "Chris Doyle", undefined];

function seedDate(daysAgo: number): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const MOCK_MEMBERS: Member[] = Array.from({ length: 42 }).map((_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length]!;
  const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length]!;
  return {
    id: `mem_${i + 1}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    phone: `+1 555-01${(10 + i).toString().padStart(2, "0")}`,
    planName: PLANS[i % PLANS.length]!,
    status: STATUSES[i % STATUSES.length]!,
    joinedOn: seedDate(30 + i * 11),
    trainerName: TRAINERS[i % TRAINERS.length],
  };
});
