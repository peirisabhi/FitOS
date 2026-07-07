"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import { useAuthStore } from "@/store/auth.store";

export function useLogout() {
  const queryClient = useQueryClient();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}
