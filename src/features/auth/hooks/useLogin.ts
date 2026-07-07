"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import { useAuthStore } from "@/store/auth.store";
import { queryKeys } from "@/constants/query-keys";
import type { LoginPayload } from "@/features/auth/types";

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (result) => {
      setUser(result.user);
      queryClient.setQueryData(queryKeys.auth.session(), {
        user: result.user,
        expiresAt: result.expiresAt,
      });
    },
  });
}
