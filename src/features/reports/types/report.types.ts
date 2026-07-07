export const REPORT_PERIODS = ["3m", "6m", "12m"] as const;
export type ReportPeriod = (typeof REPORT_PERIODS)[number];

export interface ReportTrendPoint {
  label: string;
  value: number;
}

export interface TrainerPerformanceRow {
  id: string;
  trainerName: string;
  sessionsCompleted: number;
  rating: number;
  retentionRate: number;
}

export interface ReportsSummary {
  period: ReportPeriod;
  totalRevenue: number;
  totalAttendance: number;
  newMembers: number;
  averageTrainerRating: number;
  revenueTrend: ReportTrendPoint[];
  attendanceTrend: ReportTrendPoint[];
  membershipGrowth: ReportTrendPoint[];
  trainerPerformance: TrainerPerformanceRow[];
}

export interface IReportsRepository {
  getSummary(period?: ReportPeriod): Promise<ReportsSummary>;
}
