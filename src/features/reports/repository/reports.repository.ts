import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { IReportsRepository, ReportPeriod, ReportsSummary } from "@/features/reports/types";

export const reportsRepository: IReportsRepository = {
  async getSummary(period?: ReportPeriod): Promise<ReportsSummary> {
    const res = await httpClient.get<ApiResponse<ReportsSummary>>(
      `/reports/summary${buildQueryString({ period })}`,
    );
    return res.data;
  },
};
