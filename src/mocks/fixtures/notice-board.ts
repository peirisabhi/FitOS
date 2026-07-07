import type { Notice } from "@/features/notice-board/types";

const ENTRIES: Array<[string, string, Notice["audience"], boolean, number]> = [
  ["New yoga classes starting Monday", "Join our new evening yoga sessions, 3 slots/week, Studio B.", "all", true, 2],
  ["Holiday hours", "We'll be open reduced hours on public holidays this month.", "all", false, 5],
  ["Staff meeting Friday", "Monthly staff meeting moved to Friday 8am in the back office.", "staff", false, 8],
  ["Locker room maintenance", "The east locker room will be closed for maintenance this weekend.", "members", false, 12],
  ["New equipment arrived", "New squat racks and dumbbells up to 60kg now on the floor.", "all", false, 20],
];

function seedDate(daysAgo: number): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const MOCK_NOTICES: Notice[] = ENTRIES.map(([title, body, audience, pinned, daysAgo], i) => ({
  id: `notice_${i + 1}`,
  title,
  body,
  audience,
  pinned,
  postedAt: seedDate(daysAgo),
}));
