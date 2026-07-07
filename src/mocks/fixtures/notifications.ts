import type { Notification } from "@/features/notifications/types";

const ENTRIES: Array<[string, string, Notification["category"], boolean, number]> = [
  ["Payment received", "$129 from Lucy Grant for Monthly Plus.", "billing", true, 1],
  ["New member joined", "Jordan Blake signed up for Annual Elite.", "membership", true, 3],
  ["Session rescheduled", "Priya Nair moved her Wednesday session to Thursday.", "session", false, 6],
  ["Low equipment stock", "Resistance bands running low in Studio B.", "system", false, 10],
  ["Payment overdue", "Ahmed Farouk's personal training add-on is overdue.", "billing", false, 26],
  ["Membership expiring soon", "Sarah Chen's Annual Elite plan expires in 3 days.", "membership", false, 30],
  ["New feedback received", "A member left a 5-star review.", "system", true, 34],
  ["Session cancelled", "The 6pm CrossFit WOD class was cancelled.", "session", true, 48],
];

function seedTime(hoursAgo: number): string {
  const d = new Date("2026-07-07T18:00:00Z");
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const MOCK_NOTIFICATIONS: Notification[] = ENTRIES.map(([title, message, category, read, hoursAgo], i) => ({
  id: `notif_${i + 1}`,
  title,
  message,
  category,
  read,
  createdAt: seedTime(hoursAgo),
}));
