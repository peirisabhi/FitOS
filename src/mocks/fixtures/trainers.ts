import type { Trainer } from "@/features/trainers/types";

const NAMES = [
  "Diego Alvarez", "Nina Patel", "Chris Doyle", "Sofia Marino", "Ben Carter",
  "Yuki Tanaka", "Omar Haddad", "Grace Liu",
];
const SPECIALTIES = ["Strength Training", "HIIT", "Yoga", "Nutrition Coaching", "Mobility", "CrossFit"];
const STATUSES: Trainer["status"][] = ["active", "active", "active", "on-leave", "inactive"];

function seedDate(daysAgo: number): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const MOCK_TRAINERS: Trainer[] = NAMES.map((name, i) => ({
  id: `trn_${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@gymos.com`,
  phone: `+1 555-02${(10 + i).toString().padStart(2, "0")}`,
  specialty: SPECIALTIES[i % SPECIALTIES.length]!,
  status: STATUSES[i % STATUSES.length]!,
  rating: Math.round((4.3 + (i % 5) * 0.15) * 10) / 10,
  activeClients: 8 + i * 3,
  joinedOn: seedDate(180 + i * 40),
}));
