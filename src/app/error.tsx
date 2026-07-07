"use client";

import { useEffect } from "react";
import { ErrorLayout } from "@/layouts/ErrorLayout";
import { ServerError } from "@/components/feedback/ServerError";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Swap for real error reporting (Sentry, etc.) once wired up.
    console.error(error);
  }, [error]);

  return (
    <ErrorLayout>
      <ServerError onRetry={reset} />
    </ErrorLayout>
  );
}
