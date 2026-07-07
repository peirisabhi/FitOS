import { httpClient } from "@/lib/http-client";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { ListQueryParams, PaginatedResult } from "@/repositories/base.repository";
import type { Payment, CreatePaymentDTO, UpdatePaymentDTO, IPaymentRepository } from "@/features/payments/types";

export const paymentRepository: IPaymentRepository = {
  async list(params?: ListQueryParams): Promise<PaginatedResult<Payment>> {
    const res = await httpClient.get<ApiResponse<PaginatedResult<Payment>>>(`/payments${buildQueryString(params)}`);
    return res.data;
  },
  async getById(id: string): Promise<Payment> {
    const res = await httpClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return res.data;
  },
  async create(dto: CreatePaymentDTO): Promise<Payment> {
    const res = await httpClient.post<ApiResponse<Payment>>("/payments", dto);
    return res.data;
  },
  async update(id: string, dto: UpdatePaymentDTO): Promise<Payment> {
    const res = await httpClient.patch<ApiResponse<Payment>>(`/payments/${id}`, dto);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`/payments/${id}`);
  },
};
