import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type {
  WorkoutPlan,
  CreateWorkoutPlanDTO,
  UpdateWorkoutPlanDTO,
  IWorkoutPlanRepository,
} from "@/features/workout-plans/types";

export const workoutPlanRepository: IWorkoutPlanRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<WorkoutPlan>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<WorkoutPlan>>>(
      `/workout-plans${buildQueryString(params)}`,
    );
    return res.data;
  },
  async getById(id: string): Promise<WorkoutPlan> {
    const res = await httpClient.get<ApiResponse<WorkoutPlan>>(`/workout-plans/${id}`);
    return res.data;
  },
  async create(dto: CreateWorkoutPlanDTO): Promise<WorkoutPlan> {
    const res = await httpClient.post<ApiResponse<WorkoutPlan>>("/workout-plans", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateWorkoutPlanDTO): Promise<WorkoutPlan> {
    const res = await httpClient.patch<ApiResponse<WorkoutPlan>>(`/workout-plans/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/workout-plans/${id}`);
  },
};
