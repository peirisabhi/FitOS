import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type {
  AttendanceRecord,
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
  IAttendanceRepository,
} from "@/features/attendance/types";

export const attendanceRepository: IAttendanceRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<AttendanceRecord>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<AttendanceRecord>>>(
      `/attendance${buildQueryString(params)}`,
    );
    return res.data;
  },
  async getById(id: string): Promise<AttendanceRecord> {
    const res = await httpClient.get<ApiResponse<AttendanceRecord>>(`/attendance/${id}`);
    return res.data;
  },
  async create(dto: CreateAttendanceDTO): Promise<AttendanceRecord> {
    const res = await httpClient.post<ApiResponse<AttendanceRecord>>("/attendance", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateAttendanceDTO): Promise<AttendanceRecord> {
    const res = await httpClient.patch<ApiResponse<AttendanceRecord>>(`/attendance/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/attendance/${id}`);
  },
};
