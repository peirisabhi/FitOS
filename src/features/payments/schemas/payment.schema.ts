import { z } from "zod";
import { PAYMENT_METHODS } from "@/features/payments/types";

export const paymentFormSchema = z.object({
  memberName: z.string().min(2, "Member name is required."),
  description: z.string().min(2, "Description is required."),
  amount: z.coerce.number().min(0.01, "Enter an amount greater than 0."),
  method: z.enum(PAYMENT_METHODS),
  dueOn: z.string().min(1, "Due date is required."),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
