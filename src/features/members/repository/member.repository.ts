import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { Member, CreateMemberDTO, UpdateMemberDTO, IMemberRepository } from "@/features/members/types";

/** Talks to `/members` over HTTP only — same contract a real NestJS resource would expose. */
export const memberRepository: IMemberRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<Member>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<Member>>>(`/members${buildQueryString(params)}`);
    return res.data;
  },

  async getById(id: string): Promise<Member> {
    const res = await httpClient.get<ApiResponse<Member>>(`/members/${id}`);
    return res.data;
  },

  async create(dto: CreateMemberDTO): Promise<Member> {
    const res = await httpClient.post<ApiResponse<Member>>("/members", dto);
    return res.data;
  },

  async update(id: string, dto: UpdateMemberDTO): Promise<Member> {
    const res = await httpClient.patch<ApiResponse<Member>>(`/members/${id}`, dto);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/members/${id}`);
  },
};
