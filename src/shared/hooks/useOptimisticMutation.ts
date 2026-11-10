"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

interface OptimisticMutationOptions<TData, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: QueryKey;
  /**
   * Compute the optimistic cache value from the previous value + the
   * pending variables. Return `undefined` (e.g. when there's no cached
   * value yet) to leave the cache untouched.
   */
  updater: (previous: TData | undefined, variables: TVariables) => TData | undefined;
  successMessage?: string;
  errorMessage?: string;
  context?: TContext;
}

/**
 * Standardized optimistic-update wrapper (architecture doc §1.7 / §6):
 * snapshot -> optimistic write -> rollback on error -> refetch on settle.
 * Every mutation that should feel instant (toggling status, quick edits)
 * uses this instead of hand-rolling onMutate/onError per feature.
 */
export function useOptimisticMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  updater,
  successMessage,
  errorMessage = "Something went wrong. Changes were reverted.",
}: OptimisticMutationOptions<TData, TVariables, unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TData>(queryKey);
      queryClient.setQueryData<TData>(queryKey, (current) => updater(current, variables));
      return { previous };
    },
    onError: (_err, _variables, context) => {
      const ctx = context as { previous?: TData } | undefined;
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
      toast.error(errorMessage);
    },
    onSuccess: () => {
      if (successMessage) toast.success(successMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
