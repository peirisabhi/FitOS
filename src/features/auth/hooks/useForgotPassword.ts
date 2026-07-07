"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import type { ForgotPasswordPayload } from "@/features/auth/types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
  });
}
