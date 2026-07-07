import type { ICrudRepository } from "@/repositories/base.repository";

export const PAYMENT_METHODS = ["card", "cash", "bank-transfer"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["paid", "pending", "overdue", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface Payment {
  id: string;
  memberName: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  dueOn: string;
  paidOn?: string;
}

export interface CreatePaymentDTO {
  memberName: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  dueOn: string;
}

export type UpdatePaymentDTO = Partial<CreatePaymentDTO> & { status?: PaymentStatus; paidOn?: string };

export type IPaymentRepository = ICrudRepository<Payment, CreatePaymentDTO, UpdatePaymentDTO>;
