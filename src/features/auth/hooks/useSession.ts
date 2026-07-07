"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import { useAuthStore } from "@/store/auth.store";
import { queryKeys } from "@/constants/query-keys";

/**
 * Hydrates the auth store from the session cookie on load / soft nav.
 * This is the single query that decides "is anyone logged in" — the
 * Zustand auth store is a synchronous cache of its last good result,
 * never an independent source of truth (architecture doc §1.2).
 */
export function useSession() {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  const query = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: () => authService.getSession(),
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data.user);
      setHydrated();
    } else if (query.isError) {
      setUser(null);
      setHydrated();
    }
  }, [query.isSuccess, query.isError, query.data, setUser, setHydrated]);

  return query;
}
