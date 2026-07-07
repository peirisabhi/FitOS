import type { ICrudRepository } from "@/repositories/base.repository";

export const WORKOUT_PLAN_STATUSES = ["draft", "active", "completed"] as const;
export type WorkoutPlanStatus = (typeof WORKOUT_PLAN_STATUSES)[number];

export interface WorkoutPlan {
  id: string;
  memberName: string;
  planName: string;
  focus: string;
  weekProgress: number;
  status: WorkoutPlanStatus;
  createdOn: string;
}

export interface CreateWorkoutPlanDTO {
  memberName: string;
  planName: string;
  focus: string;
}

export type UpdateWorkoutPlanDTO = Partial<CreateWorkoutPlanDTO> & {
  status?: WorkoutPlanStatus;
  weekProgress?: number;
};

export type IWorkoutPlanRepository = ICrudRepository<WorkoutPlan, CreateWorkoutPlanDTO, UpdateWorkoutPlanDTO>;
