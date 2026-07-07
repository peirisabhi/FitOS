import { z } from "zod";

export const trainerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  specialty: z.string().min(1, "Select a specialty."),
});

export type TrainerFormValues = z.infer<typeof trainerFormSchema>;
