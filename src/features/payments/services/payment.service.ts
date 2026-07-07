import { paymentRepository } from "@/features/payments/repository";

export const paymentService = {
  list: paymentRepository.list,
  getById: paymentRepository.getById,
  create: paymentRepository.create,
  update: paymentRepository.update,
  remove: paymentRepository.remove,
};
