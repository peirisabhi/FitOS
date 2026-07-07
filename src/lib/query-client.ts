import { QueryClient } from "@tanstack/react-query";

/**
 * One QueryClient per browser session (created lazily in the client-only
 * QueryProvider). Sane enterprise defaults: no refetch storms on window
 * focus for mock data, short-ish staleTime so widgets feel live without
 * hammering the (eventually real) API.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
