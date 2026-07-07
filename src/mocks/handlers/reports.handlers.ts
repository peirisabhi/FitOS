import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { buildReportsSummary } from "@/mocks/fixtures/reports";
import type { ReportPeriod } from "@/features/reports/types";
import { REPORT_PERIODS } from "@/features/reports/types";

const baseUrl = siteConfig.api.baseUrl;

export const reportsHandlers = [
  http.get(`${baseUrl}/reports/summary`, ({ request }) => {
    const url = new URL(request.url);
    const requested = url.searchParams.get("period");
    const period: ReportPeriod = REPORT_PERIODS.includes(requested as ReportPeriod)
      ? (requested as ReportPeriod)
      : "12m";

    return HttpResponse.json({ data: buildReportsSummary(period) });
  }),
];
