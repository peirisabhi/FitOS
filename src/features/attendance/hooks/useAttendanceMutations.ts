"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { attendanceService } from "@/features/attendance/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateAttendanceDTO } from "@/features/attendance/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAttendanceDTO) => attendanceService.create(dto),
    onSuccess: () => {
      toast.success("Checked in.");
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't check in.")),
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      attendanceService.update(id, { checkOutAt: new Date().toISOString(), status: "checked-out" }),
    onSuccess: () => {
      toast.success("Checked out.");
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't check out.")),
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attendanceService.remove(id),
    onSuccess: () => {
      toast.success("Record removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove record.")),
  });
}
