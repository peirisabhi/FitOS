"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { MockProvider } from "@/providers/MockProvider";
import { PwaProvider } from "@/providers/PwaProvider";
import { Toaster } from "@/components/ui/sonner";

/** Single composition root — app/layout.tsx wraps children in exactly this, nothing else. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MockProvider>
      <QueryProvider>
        <ThemeProvider>
          <PwaProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </PwaProvider>
        </ThemeProvider>
      </QueryProvider>
    </MockProvider>
  );
}
