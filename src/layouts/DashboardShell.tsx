"use client";

import type { ReactNode } from "react";
import { useSession } from "@/features/auth";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Navbar } from "@/components/navigation/Navbar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CommandPalette } from "@/components/overlays/CommandPalette";
import { PageTransition } from "@/components/motion";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The single shared shell for every authenticated role (architecture doc
 * §1.4). What differs per role is which nav items and dashboard widgets are
 * visible — driven entirely by `navigation.config.ts` + the permission
 * matrix, never a separate layout tree per role.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  useSession();
  const { isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-3 p-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* WCAG 2.4.1 "Bypass Blocks" — invisible until focused via keyboard (Tab). */}
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6"
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
      <CommandPalette />
    </div>
  );
}
