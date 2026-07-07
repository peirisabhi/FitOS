"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { memberService } from "@/features/members/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateMemberDTO, UpdateMemberDTO } from "@/features/members/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMemberDTO) => memberService.create(dto),
    onSuccess: () => {
      toast.success("Member added.");
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't add member.")),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMemberDTO }) => memberService.update(id, dto),
    onSuccess: () => {
      toast.success("Member updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update member.")),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memberService.remove(id),
    onSuccess: () => {
      toast.success("Member removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove member.")),
  });
}
