"use client";

import { useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site.config";

/**
 * Starts the MSW browser worker exactly once, only when
 * NEXT_PUBLIC_API_MODE=mock. Flipping that env var to "rest" (and removing
 * this provider from the tree, or leaving it — it's a no-op in rest mode)
 * is the entire "go live" step; no repository/service/hook code changes
 * (architecture doc §1.1).
 */
export function MockProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(siteConfig.api.mode !== "mock");

  useEffect(() => {
    if (siteConfig.api.mode !== "mock") return;

    let cancelled = false;
    import("@/mocks/browser").then(({ worker }) => {
      worker
        .start({ onUnhandledRequest: "bypass", quiet: true })
        .then(() => {
          if (!cancelled) setReady(true);
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
