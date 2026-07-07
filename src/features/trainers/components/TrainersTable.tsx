"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useTrainers, useDeleteTrainer } from "@/features/trainers/hooks";
import { TrainerFormDialog } from "@/features/trainers/components/TrainerFormDialog";
import type { Trainer, TrainerStatus } from "@/features/trainers/types";

const STATUS_BADGE: Record<TrainerStatus, "success" | "warning" | "secondary"> = {
  active: "success",
  "on-leave": "warning",
  inactive: "secondary",
};

export function TrainersTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | undefined>(undefined);
  const [deletingTrainer, setDeletingTrainer] = useState<Trainer | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useTrainers({ search: debouncedSearch, pageSize: 500 });
  const deleteTrainer = useDeleteTrainer();

  const columns = useMemo<ColumnDef<Trainer>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      { accessorKey: "specialty", header: "Specialty" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={STATUS_BADGE[row.original.status]} className="capitalize">
            {row.original.status.replace("-", " ")}
          </Badge>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) =>
          row.original.rating > 0 ? (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" /> {row.original.rating}
            </span>
          ) : (
            "—"
          ),
      },
      { accessorKey: "activeClients", header: "Active Clients" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const trainer = row.original;
          if (!can(["trainers:write", "trainers:delete"])) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {can("trainers:write") && (
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingTrainer(trainer);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {can("trainers:delete") && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeletingTrainer(trainer)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                )}
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
            placeholder="Search trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="trainers:write">
          <Button
            onClick={() => {
              setEditingTrainer(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Trainer
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No trainers yet"
        emptyDescription="Add your first trainer to get started."
        pageSize={10}
      />

      <TrainerFormDialog open={formOpen} onOpenChange={setFormOpen} trainer={editingTrainer} />

      <ConfirmDialog
        open={Boolean(deletingTrainer)}
        onOpenChange={(open) => !open && setDeletingTrainer(undefined)}
        title={`Remove ${deletingTrainer?.name}?`}
        description="This will permanently remove this trainer's profile. This can't be undone."
        confirmLabel="Remove"
        isLoading={deleteTrainer.isPending}
        onConfirm={() => {
          if (!deletingTrainer) return;
          deleteTrainer.mutate(deletingTrainer.id, { onSuccess: () => setDeletingTrainer(undefined) });
        }}
      />
    </div>
  );
}
