import { z } from "zod";

export const memberFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  planName: z.string().min(1, "Select a plan."),
  trainerName: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
