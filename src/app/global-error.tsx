"use client";

import { useEffect } from "react";
import { ServerError } from "@/components/feedback/ServerError";
import "@/app/globals.css";

/**
 * Only rendered when the ROOT layout itself throws (providers, fonts,
 * etc.) — must render its own <html>/<body> since it replaces the root
 * layout entirely.
 */
export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <ServerError onRetry={reset} />
        </div>
      </body>
    </html>
  );
}
