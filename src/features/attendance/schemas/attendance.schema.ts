import { z } from "zod";
import { CHECK_IN_METHODS } from "@/features/attendance/types";

export const checkInFormSchema = z.object({
  memberName: z.string().min(2, "Member name is required."),
  method: z.enum(CHECK_IN_METHODS),
});

export type CheckInFormValues = z.infer<typeof checkInFormSchema>;
