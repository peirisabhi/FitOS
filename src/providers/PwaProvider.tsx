"use client";

import { useEffect, type ReactNode } from "react";
import { siteConfig } from "@/config/site.config";

/**
 * Registers the offline-caching service worker (public/sw.js) — but only
 * in production, and only when NOT running against MSW mocks. MSW's own
 * mockServiceWorker.js registers at the same "/" scope; running both
 * would fight over which one intercepts requests. In a real deployment
 * against the NestJS API (NEXT_PUBLIC_API_MODE=rest), that conflict never
 * arises, so this is the safe default rather than something to configure
 * per-environment.
 */
export function PwaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const canRegister =
      process.env.NODE_ENV === "production" &&
      siteConfig.api.mode !== "mock" &&
      "serviceWorker" in navigator;

    if (!canRegister) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Non-fatal — the app works fine without offline support, this is a progressive enhancement.
    });
  }, []);

  return <>{children}</>;
}
