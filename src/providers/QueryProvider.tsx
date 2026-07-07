"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState (not useMemo/module scope) so each browser session gets its own
  // client instance — critical once this is server-rendered per request.
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
