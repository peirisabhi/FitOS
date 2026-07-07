"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display";
import { ConfirmDialog } from "@/components/overlays";
import { RequirePermission } from "@/shared/components";
import { usePermission } from "@/hooks/usePermission";
import { useDebouncedValue } from "@/shared/hooks";
import { useWorkoutPlans, useDeleteWorkoutPlan } from "@/features/workout-plans/hooks";
import { WorkoutPlanFormDialog } from "@/features/workout-plans/components/WorkoutPlanFormDialog";
import type { WorkoutPlan, WorkoutPlanStatus } from "@/features/workout-plans/types";

const STATUS_BADGE: Record<WorkoutPlanStatus, "secondary" | "success" | "warning"> = {
  draft: "secondary",
  active: "success",
  completed: "warning",
};

export function WorkoutPlansTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | undefined>(undefined);
  const [deletingPlan, setDeletingPlan] = useState<WorkoutPlan | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useWorkoutPlans({ search: debouncedSearch, pageSize: 500 });
  const deleteWorkoutPlan = useDeleteWorkoutPlan();

  const columns = useMemo<ColumnDef<WorkoutPlan>[]>(
    () => [
      {
        accessorKey: "memberName",
        header: "Member",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.memberName}</p>
            <p className="text-xs text-muted-foreground">{row.original.planName}</p>
          </div>
        ),
      },
      { accessorKey: "focus", header: "Focus" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={STATUS_BADGE[row.original.status]} className="capitalize">
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "weekProgress",
        header: "Progress",
        cell: ({ row }) => (
          <div className="w-32 space-y-1">
            <span className="text-xs text-muted-foreground">{row.original.weekProgress}%</span>
            <Progress value={row.original.weekProgress} />
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const plan = row.original;
          if (!can("workout-plans:write")) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingPlan(plan);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeletingPlan(plan)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [can],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workout plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="workout-plans:write">
          <Button
            onClick={() => {
              setEditingPlan(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Assign Plan
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No workout plans yet"
        emptyDescription="Assign a training program to get started."
        pageSize={10}
      />

      <WorkoutPlanFormDialog open={formOpen} onOpenChange={setFormOpen} workoutPlan={editingPlan} />

      <ConfirmDialog
        open={Boolean(deletingPlan)}
        onOpenChange={(open) => !open && setDeletingPlan(undefined)}
        title={`Remove ${deletingPlan?.planName}?`}
        description="This will unassign this workout plan. This can't be undone."
        confirmLabel="Remove"
        isLoading={deleteWorkoutPlan.isPending}
        onConfirm={() => {
          if (!deletingPlan) return;
          deleteWorkoutPlan.mutate(deletingPlan.id, { onSuccess: () => setDeletingPlan(undefined) });
        }}
      />
    </div>
  );
}
