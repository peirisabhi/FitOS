import { trainerRepository } from "@/features/trainers/repository";

export const trainerService = {
  list: trainerRepository.list,
  getById: trainerRepository.getById,
  create: trainerRepository.create,
  update: trainerRepository.update,
  remove: trainerRepository.remove,
};
