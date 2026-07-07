import type { ICrudRepository } from "@/repositories/base.repository";

export const CHECK_IN_METHODS = ["qr", "manual", "biometric"] as const;
export type CheckInMethod = (typeof CHECK_IN_METHODS)[number];

export const ATTENDANCE_STATUSES = ["checked-in", "checked-out"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface AttendanceRecord {
  id: string;
  memberName: string;
  checkInAt: string;
  checkOutAt?: string;
  method: CheckInMethod;
  status: AttendanceStatus;
}

export interface CreateAttendanceDTO {
  memberName: string;
  method: CheckInMethod;
}

export type UpdateAttendanceDTO = { checkOutAt?: string; status?: AttendanceStatus };

export type IAttendanceRepository = ICrudRepository<AttendanceRecord, CreateAttendanceDTO, UpdateAttendanceDTO>;
