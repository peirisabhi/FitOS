import { sessionRepository } from "@/features/sessions/repository";

export const sessionService = {
  list: sessionRepository.list,
  getById: sessionRepository.getById,
  create: sessionRepository.create,
  update: sessionRepository.update,
  remove: sessionRepository.remove,
};
