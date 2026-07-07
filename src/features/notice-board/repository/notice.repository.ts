import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { Notice, CreateNoticeDTO, UpdateNoticeDTO, INoticeRepository } from "@/features/notice-board/types";

export const noticeRepository: INoticeRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<Notice>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<Notice>>>(`/notice-board${buildQueryString(params)}`);
    return res.data;
  },
  async getById(id: string): Promise<Notice> {
    const res = await httpClient.get<ApiResponse<Notice>>(`/notice-board/${id}`);
    return res.data;
  },
  async create(dto: CreateNoticeDTO): Promise<Notice> {
    const res = await httpClient.post<ApiResponse<Notice>>("/notice-board", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateNoticeDTO): Promise<Notice> {
    const res = await httpClient.patch<ApiResponse<Notice>>(`/notice-board/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/notice-board/${id}`);
  },
};
