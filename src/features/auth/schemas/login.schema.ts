import { z } from "zod";

/**
 * Single source of truth for the Login shape — drives both the React
 * Hook Form resolver and (conceptually) the request payload validation.
 */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
