import { noticeRepository } from "@/features/notice-board/repository";

export const noticeService = {
  list: noticeRepository.list,
  getById: noticeRepository.getById,
  create: noticeRepository.create,
  update: noticeRepository.update,
  remove: noticeRepository.remove,
};
