import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const organizationFormSchema = z.object({
  tenantName: z.string().min(2, "Organization name must be at least 2 characters."),
});
export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
