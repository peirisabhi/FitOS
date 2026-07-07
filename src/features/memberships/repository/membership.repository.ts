import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type {
  MembershipPlan,
  CreateMembershipPlanDTO,
  UpdateMembershipPlanDTO,
  IMembershipPlanRepository,
} from "@/features/memberships/types";

export const membershipPlanRepository: IMembershipPlanRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<MembershipPlan>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<MembershipPlan>>>(
      `/memberships${buildQueryString(params)}`,
    );
    return res.data;
  },
  async getById(id: string): Promise<MembershipPlan> {
    const res = await httpClient.get<ApiResponse<MembershipPlan>>(`/memberships/${id}`);
    return res.data;
  },
  async create(dto: CreateMembershipPlanDTO): Promise<MembershipPlan> {
    const res = await httpClient.post<ApiResponse<MembershipPlan>>("/memberships", dto);
    return res.data;
  },
  async update(id: string, dto: UpdateMembershipPlanDTO): Promise<MembershipPlan> {
    const res = await httpClient.patch<ApiResponse<MembershipPlan>>(`/memberships/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/memberships/${id}`);
  },
};
