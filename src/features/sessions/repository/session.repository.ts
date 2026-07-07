import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { GymSession, CreateSessionDTO, UpdateSessionDTO, ISessionRepository } from "@/features/sessions/types";

export const sessionRepository: ISessionRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<GymSession>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<GymSession>>>(`/sessions${buildQueryString(params)}`);
    return res.data;
  },
  async getById(id: string): Promise<GymSession> {
    const res = await httpClient.get<ApiResponse<GymSession>>(`/sessions/${id}`);
    return res.data;
  },
  async create(dto: CreateSessionDTO): Promise<GymSession> {
    const res = await httpClient.post<ApiResponse<GymSession>>("/sessions", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateSessionDTO): Promise<GymSession> {
    const res = await httpClient.patch<ApiResponse<GymSession>>(`/sessions/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/sessions/${id}`);
  },
};
