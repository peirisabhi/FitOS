import type { ICrudRepository } from "@/repositories/base.repository";

export const MEMBER_STATUSES = ["active", "expiring", "expired", "frozen"] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  planName: string;
  status: MemberStatus;
  joinedOn: string;
  trainerName?: string;
}

export interface CreateMemberDTO {
  name: string;
  email: string;
  phone: string;
  planName: string;
  trainerName?: string;
}

export type UpdateMemberDTO = Partial<CreateMemberDTO> & { status?: MemberStatus };

export type IMemberRepository = ICrudRepository<Member, CreateMemberDTO, UpdateMemberDTO>;
