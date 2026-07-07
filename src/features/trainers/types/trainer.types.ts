import type { ICrudRepository } from "@/repositories/base.repository";

export const TRAINER_STATUSES = ["active", "on-leave", "inactive"] as const;
export type TrainerStatus = (typeof TRAINER_STATUSES)[number];

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: TrainerStatus;
  rating: number;
  activeClients: number;
  joinedOn: string;
}

export interface CreateTrainerDTO {
  name: string;
  email: string;
  phone: string;
  specialty: string;
}

export type UpdateTrainerDTO = Partial<CreateTrainerDTO> & { status?: TrainerStatus };

export type ITrainerRepository = ICrudRepository<Trainer, CreateTrainerDTO, UpdateTrainerDTO>;
