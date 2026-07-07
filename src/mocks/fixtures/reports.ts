import type { ReportPeriod, ReportsSummary, ReportTrendPoint } from "@/features/reports/types";

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const REVENUE_BASE = [31200, 32900, 34500, 33800, 35900, 37200, 36200, 38950, 41100, 43850, 44420, 48230];
const ATTENDANCE_BASE = [7200, 7480, 7650, 7100, 6900, 7300, 7550, 7800, 8100, 8420, 8600, 8950];
const GROWTH_BASE = [980, 1005, 1040, 1060, 1090, 1110, 1140, 1170, 1198, 1225, 1254, 1284];

function monthsFor(period: ReportPeriod): number {
  return period === "3m" ? 3 : period === "6m" ? 6 : 12;
}

function series(base: number[], period: ReportPeriod): ReportTrendPoint[] {
  const count = monthsFor(period);
  const labels = MONTHS.slice(MONTHS.length - count);
  const values = base.slice(base.length - count);
  return labels.map((label, i) => ({ label, value: values[i]! }));
}

export function buildReportsSummary(period: ReportPeriod): ReportsSummary {
  const revenueTrend = series(REVENUE_BASE, period);
  const attendanceTrend = series(ATTENDANCE_BASE, period);
  const membershipGrowth = series(GROWTH_BASE, period);

  return {
    period,
    totalRevenue: revenueTrend.reduce((sum, p) => sum + p.value, 0),
    totalAttendance: attendanceTrend.reduce((sum, p) => sum + p.value, 0),
    newMembers: membershipGrowth[membershipGrowth.length - 1]!.value - membershipGrowth[0]!.value,
    averageTrainerRating: 4.7,
    revenueTrend,
    attendanceTrend,
    membershipGrowth,
    trainerPerformance: [
      { id: "tp_1", trainerName: "Diego Alvarez", sessionsCompleted: 142, rating: 4.9, retentionRate: 92 },
      { id: "tp_2", trainerName: "Nina Patel", sessionsCompleted: 128, rating: 4.7, retentionRate: 88 },
      { id: "tp_3", trainerName: "Chris Doyle", sessionsCompleted: 96, rating: 4.5, retentionRate: 81 },
      { id: "tp_4", trainerName: "Sofia Marino", sessionsCompleted: 84, rating: 4.6, retentionRate: 85 },
    ],
  };
}
