import { attendanceRepository } from "@/features/attendance/repository";

export const attendanceService = {
  list: attendanceRepository.list,
  getById: attendanceRepository.getById,
  create: attendanceRepository.create,
  update: attendanceRepository.update,
  remove: attendanceRepository.remove,
};
