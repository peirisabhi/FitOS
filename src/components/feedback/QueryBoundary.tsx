"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

interface QueryBoundaryProps<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined;
  onRetry?: () => void;
  loadingFallback: ReactNode;
  /** Return true when `data` should be treated as "no results" (e.g. an empty array). */
  isEmpty?: (data: T) => boolean;
  emptyState?: ReactNode;
  errorTitle?: string;
  children: (data: T) => ReactNode;
}

/**
 * The single place loading / error / empty branching happens (architecture
 * doc §1.7). Every list/detail page wraps its query result in this instead
 * of re-implementing the same three `if` branches.
 */
export function QueryBoundary<T>({
  isLoading,
  isError,
  data,
  onRetry,
  loadingFallback,
  isEmpty,
  emptyState,
  errorTitle,
  children,
}: QueryBoundaryProps<T>) {
  if (isLoading) return <>{loadingFallback}</>;
  if (isError) return <ErrorState title={errorTitle} onRetry={onRetry} />;
  if (data === undefined) return <>{loadingFallback}</>;
  if (isEmpty?.(data)) return <>{emptyState ?? <EmptyState title="Nothing to show yet" />}</>;
  return <>{children(data)}</>;
}
