"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { useMembershipPlans, useDeleteMembershipPlan } from "@/features/memberships/hooks";
import { MembershipPlanFormDialog } from "@/features/memberships/components/MembershipPlanFormDialog";
import type { MembershipPlan } from "@/features/memberships/types";

const CYCLE_LABELS: Record<MembershipPlan["billingCycle"], string> = {
  monthly: "/ month",
  quarterly: "/ quarter",
  annual: "/ year",
  "one-time": "one-time",
};

export function MembershipPlansTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | undefined>(undefined);
  const [deletingPlan, setDeletingPlan] = useState<MembershipPlan | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useMembershipPlans({ search: debouncedSearch, pageSize: 500 });
  const deletePlan = useDeleteMembershipPlan();

  const columns = useMemo<ColumnDef<MembershipPlan>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Plan",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            {row.original.description && (
              <p className="max-w-xs truncate text-xs text-muted-foreground">{row.original.description}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span>
            ${row.original.price} <span className="text-xs text-muted-foreground">{CYCLE_LABELS[row.original.billingCycle]}</span>
          </span>
        ),
      },
      { accessorKey: "durationDays", header: "Duration", cell: ({ row }) => `${row.original.durationDays} days` },
      { accessorKey: "activeSubscribers", header: "Active Subscribers" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "active" ? "success" : "secondary"} className="capitalize">
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const plan = row.original;
          if (!can("memberships:write")) return null;
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
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="memberships:write">
          <Button
            onClick={() => {
              setEditingPlan(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No membership plans yet"
        emptyDescription="Create your first plan to get started."
        pageSize={10}
      />

      <MembershipPlanFormDialog open={formOpen} onOpenChange={setFormOpen} plan={editingPlan} />

      <ConfirmDialog
        open={Boolean(deletingPlan)}
        onOpenChange={(open) => !open && setDeletingPlan(undefined)}
        title={`Remove ${deletingPlan?.name}?`}
        description="Members currently on this plan will keep it until it expires, but it won't be offered for new signups. This can't be undone."
        confirmLabel="Remove"
        isLoading={deletePlan.isPending}
        onConfirm={() => {
          if (!deletingPlan) return;
          deletePlan.mutate(deletingPlan.id, { onSuccess: () => setDeletingPlan(undefined) });
        }}
      />
    </div>
  );
}
