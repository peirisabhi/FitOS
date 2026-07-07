import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { Trainer, CreateTrainerDTO, UpdateTrainerDTO, ITrainerRepository } from "@/features/trainers/types";

export const trainerRepository: ITrainerRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<Trainer>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<Trainer>>>(`/trainers${buildQueryString(params)}`);
    return res.data;
  },
  async getById(id: string): Promise<Trainer> {
    const res = await httpClient.get<ApiResponse<Trainer>>(`/trainers/${id}`);
    return res.data;
  },
  async create(dto: CreateTrainerDTO): Promise<Trainer> {
    const res = await httpClient.post<ApiResponse<Trainer>>("/trainers", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateTrainerDTO): Promise<Trainer> {
    const res = await httpClient.patch<ApiResponse<Trainer>>(`/trainers/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/trainers/${id}`);
  },
};
