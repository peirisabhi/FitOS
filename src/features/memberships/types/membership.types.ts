import type { ICrudRepository } from "@/repositories/base.repository";

export const BILLING_CYCLES = ["monthly", "quarterly", "annual", "one-time"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const MEMBERSHIP_PLAN_STATUSES = ["active", "inactive"] as const;
export type MembershipPlanStatus = (typeof MEMBERSHIP_PLAN_STATUSES)[number];

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  status: MembershipPlanStatus;
  activeSubscribers: number;
}

export interface CreateMembershipPlanDTO {
  name: string;
  description?: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
}

export type UpdateMembershipPlanDTO = Partial<CreateMembershipPlanDTO> & { status?: MembershipPlanStatus };

export type IMembershipPlanRepository = ICrudRepository<MembershipPlan, CreateMembershipPlanDTO, UpdateMembershipPlanDTO>;
