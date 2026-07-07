"use client";

import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-semibold tracking-tight text-muted-foreground">500</p>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <ServerCrash className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold">Something went wrong on our end</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Our team has been notified. Please try again in a moment.
        </p>
      </div>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
