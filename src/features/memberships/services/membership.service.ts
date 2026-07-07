import { membershipPlanRepository } from "@/features/memberships/repository";

export const membershipPlanService = {
  list: membershipPlanRepository.list,
  getById: membershipPlanRepository.getById,
  create: membershipPlanRepository.create,
  update: membershipPlanRepository.update,
  remove: membershipPlanRepository.remove,
};
