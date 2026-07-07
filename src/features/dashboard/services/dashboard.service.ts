import { dashboardRepository } from "@/features/dashboard/repository";

/**
 * Thin orchestration layer kept for symmetry with every other feature
 * (architecture doc §7) — dashboard has no side effects to own today, but
 * hooks depend on this, never the repository directly, so adding one later
 * (e.g. client-side caching of widget preferences) doesn't ripple upward.
 */
export const dashboardService = {
  getOwnerSummary: () => dashboardRepository.getOwnerSummary(),
  getTrainerSummary: () => dashboardRepository.getTrainerSummary(),
  getMemberSummary: () => dashboardRepository.getMemberSummary(),
};
