"use client";

import { useAuthStore } from "@/store/auth.store";

/**
 * The one hook UI code should reach for to answer "who's logged in".
 * Thin wrapper over the auth store so components never import the store
 * directly (keeps the store an implementation detail).
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return {
    user,
    isAuthenticated: Boolean(user),
    isHydrated,
  };
}
