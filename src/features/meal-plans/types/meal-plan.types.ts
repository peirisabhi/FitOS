import type { ICrudRepository } from "@/repositories/base.repository";

export const MEAL_PLAN_STATUSES = ["draft", "active", "completed"] as const;
export type MealPlanStatus = (typeof MEAL_PLAN_STATUSES)[number];

export interface MealPlan {
  id: string;
  memberName: string;
  planName: string;
  dailyCalories: number;
  compliance: number;
  status: MealPlanStatus;
  createdOn: string;
}

export interface CreateMealPlanDTO {
  memberName: string;
  planName: string;
  dailyCalories: number;
}

export type UpdateMealPlanDTO = Partial<CreateMealPlanDTO> & { status?: MealPlanStatus; compliance?: number };

export type IMealPlanRepository = ICrudRepository<MealPlan, CreateMealPlanDTO, UpdateMealPlanDTO>;
