import { workoutPlanRepository } from "@/features/workout-plans/repository";

export const workoutPlanService = {
  list: workoutPlanRepository.list,
  getById: workoutPlanRepository.getById,
  create: workoutPlanRepository.create,
  update: workoutPlanRepository.update,
  remove: workoutPlanRepository.remove,
};
