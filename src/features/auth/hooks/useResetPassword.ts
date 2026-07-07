"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import type { ResetPasswordPayload } from "@/features/auth/types";

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
  });
}
