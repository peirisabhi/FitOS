import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";

/** Centered card shell for login / forgot-password / reset-password. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
            G
          </div>
          <h1 className="text-lg font-semibold">{siteConfig.name}</h1>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
