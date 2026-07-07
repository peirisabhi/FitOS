import { z } from "zod";
import { SESSION_TYPES } from "@/features/sessions/types";

export const sessionFormSchema = z
  .object({
    title: z.string().min(2, "Title is required."),
    type: z.enum(SESSION_TYPES),
    trainerName: z.string().min(2, "Trainer is required."),
    memberName: z.string().optional(),
    location: z.string().min(1, "Location is required."),
    date: z.string().min(1, "Date is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
  })
  .refine((data) => data.type === "class" || Boolean(data.memberName), {
    message: "Member is required for personal training sessions.",
    path: ["memberName"],
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
