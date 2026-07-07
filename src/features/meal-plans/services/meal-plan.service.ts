import { mealPlanRepository } from "@/features/meal-plans/repository";

export const mealPlanService = {
  list: mealPlanRepository.list,
  getById: mealPlanRepository.getById,
  create: mealPlanRepository.create,
  update: mealPlanRepository.update,
  remove: mealPlanRepository.remove,
};
