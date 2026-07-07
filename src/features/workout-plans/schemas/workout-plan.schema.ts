import { z } from "zod";

export const workoutPlanFormSchema = z.object({
  memberName: z.string().min(2, "Member name is required."),
  planName: z.string().min(2, "Plan name is required."),
  focus: z.string().min(2, "Describe the plan's focus."),
});

export type WorkoutPlanFormValues = z.infer<typeof workoutPlanFormSchema>;
