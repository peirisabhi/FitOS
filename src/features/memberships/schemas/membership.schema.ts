import { z } from "zod";
import { BILLING_CYCLES } from "@/features/memberships/types";

export const membershipPlanFormSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price can't be negative."),
  billingCycle: z.enum(BILLING_CYCLES),
  durationDays: z.coerce.number().min(1, "Duration must be at least 1 day."),
});

export type MembershipPlanFormValues = z.infer<typeof membershipPlanFormSchema>;
