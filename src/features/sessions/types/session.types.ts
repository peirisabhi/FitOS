import type { ICrudRepository } from "@/repositories/base.repository";

export const SESSION_TYPES = ["class", "personal"] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const SESSION_STATUSES = ["scheduled", "completed", "cancelled"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export interface GymSession {
  id: string;
  title: string;
  type: SessionType;
  trainerName: string;
  memberName?: string;
  start: string;
  end: string;
  location: string;
  status: SessionStatus;
}

export interface CreateSessionDTO {
  title: string;
  type: SessionType;
  trainerName: string;
  memberName?: string;
  start: string;
  end: string;
  location: string;
}

export type UpdateSessionDTO = Partial<CreateSessionDTO> & { status?: SessionStatus };

export type ISessionRepository = ICrudRepository<GymSession, CreateSessionDTO, UpdateSessionDTO>;
