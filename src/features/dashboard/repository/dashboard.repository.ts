import { httpClient } from "@/lib/http-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  IDashboardRepository,
  OwnerDashboardData,
  TrainerDashboardData,
  MemberDashboardData,
} from "@/features/dashboard/types";

/** Talks to `/dashboard/*` over HTTP only — identical whether MSW or a real NestJS instance answers. */
export const dashboardRepository: IDashboardRepository = {
  async getOwnerSummary(): Promise<OwnerDashboardData> {
    const res = await httpClient.get<ApiResponse<OwnerDashboardData>>("/dashboard/owner");
    return res.data;
  },

  async getTrainerSummary(): Promise<TrainerDashboardData> {
    const res = await httpClient.get<ApiResponse<TrainerDashboardData>>("/dashboard/trainer");
    return res.data;
  },

  async getMemberSummary(): Promise<MemberDashboardData> {
    const res = await httpClient.get<ApiResponse<MemberDashboardData>>("/dashboard/member");
    return res.data;
  },
};
