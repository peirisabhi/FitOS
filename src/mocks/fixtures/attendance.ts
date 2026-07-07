import type { AttendanceRecord } from "@/features/attendance/types";

const NAMES = [
  "Jordan Blake", "Sarah Chen", "Marcus Webb", "Elena Ruiz", "Tom Baker", "Ravi Kumar",
  "Lucy Grant", "Ahmed Farouk", "Nina Patel", "Chris Doyle", "Priya Nair", "Hannah Lee",
];
const METHODS: AttendanceRecord["method"][] = ["qr", "qr", "manual", "biometric"];

function seedTime(hoursAgo: number): string {
  const d = new Date("2026-07-07T18:00:00Z");
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const MOCK_ATTENDANCE: AttendanceRecord[] = NAMES.map((memberName, i) => {
  const checkedOut = i % 3 !== 0;
  const checkInAt = seedTime(2 + i * 1.5);
  return {
    id: `att_${i + 1}`,
    memberName,
    checkInAt,
    checkOutAt: checkedOut ? seedTime(1 + i * 1.2) : undefined,
    method: METHODS[i % METHODS.length]!,
    status: checkedOut ? "checked-out" : "checked-in",
  };
});
