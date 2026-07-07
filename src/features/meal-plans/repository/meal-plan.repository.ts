import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { MealPlan, CreateMealPlanDTO, UpdateMealPlanDTO, IMealPlanRepository } from "@/features/meal-plans/types";

export const mealPlanRepository: IMealPlanRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<MealPlan>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<MealPlan>>>(`/meal-plans${buildQueryString(params)}`);
    return res.data;
  },
  async getById(id: string): Promise<MealPlan> {
    const res = await httpClient.get<ApiResponse<MealPlan>>(`/meal-plans/${id}`);
    return res.data;
  },
  async create(dto: CreateMealPlanDTO): Promise<MealPlan> {
    const res = await httpClient.post<ApiResponse<MealPlan>>("/meal-plans", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateMealPlanDTO): Promise<MealPlan> {
    const res = await httpClient.patch<ApiResponse<MealPlan>>(`/meal-plans/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/meal-plans/${id}`);
  },
};
