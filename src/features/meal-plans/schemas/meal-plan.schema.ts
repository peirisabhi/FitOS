import { z } from "zod";

export const mealPlanFormSchema = z.object({
  memberName: z.string().min(2, "Member name is required."),
  planName: z.string().min(2, "Plan name is required."),
  dailyCalories: z.coerce.number().min(800, "Enter a realistic calorie target.").max(6000, "Enter a realistic calorie target."),
});

export type MealPlanFormValues = z.infer<typeof mealPlanFormSchema>;
