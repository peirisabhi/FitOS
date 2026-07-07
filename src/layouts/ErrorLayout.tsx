import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";

/** Shared chrome for error.tsx / not-found.tsx / global-error.tsx / 403. */
export function ErrorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
            G
          </div>
          <span className="text-sm font-semibold">{siteConfig.name}</span>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
