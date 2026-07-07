import type { GymSession } from "@/features/sessions/types";

function at(daysFromNow: number, hour: number, minute = 0): string {
  const d = new Date("2026-07-07T00:00:00Z");
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const MOCK_SESSIONS: GymSession[] = [
  {
    id: "sess_1",
    title: "HIIT Group Class",
    type: "class",
    trainerName: "Diego Alvarez",
    start: at(0, 18, 0),
    end: at(0, 19, 0),
    location: "Studio A",
    status: "scheduled",
  },
  {
    id: "sess_2",
    title: "Strength Coaching",
    type: "personal",
    trainerName: "Diego Alvarez",
    memberName: "Jordan Blake",
    start: at(1, 8, 0),
    end: at(1, 9, 0),
    location: "Floor 2",
    status: "scheduled",
  },
  {
    id: "sess_3",
    title: "Mobility & Recovery",
    type: "personal",
    trainerName: "Nina Patel",
    memberName: "Priya Nair",
    start: at(1, 10, 0),
    end: at(1, 11, 0),
    location: "Studio C",
    status: "scheduled",
  },
  {
    id: "sess_4",
    title: "Yoga Flow",
    type: "class",
    trainerName: "Nina Patel",
    start: at(2, 7, 0),
    end: at(2, 8, 0),
    location: "Studio B",
    status: "scheduled",
  },
  {
    id: "sess_5",
    title: "Strength Coaching",
    type: "personal",
    trainerName: "Diego Alvarez",
    memberName: "Jordan Blake",
    start: at(-1, 8, 0),
    end: at(-1, 9, 0),
    location: "Floor 2",
    status: "completed",
  },
  {
    id: "sess_6",
    title: "CrossFit WOD",
    type: "class",
    trainerName: "Chris Doyle",
    start: at(-2, 17, 0),
    end: at(-2, 18, 0),
    location: "Studio A",
    status: "cancelled",
  },
];
