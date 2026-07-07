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
import { useMembers, useDeleteMember } from "@/features/members/hooks";
import { MemberFormDialog } from "@/features/members/components/MemberFormDialog";
import type { Member, MemberStatus } from "@/features/members/types";

const STATUS_BADGE: Record<MemberStatus, "success" | "warning" | "destructive" | "secondary"> = {
  active: "success",
  expiring: "warning",
  expired: "destructive",
  frozen: "secondary",
};

export function MembersTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const [deletingMember, setDeletingMember] = useState<Member | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useMembers({ search: debouncedSearch, pageSize: 500 });
  const deleteMember = useDeleteMember();

  const columns = useMemo<ColumnDef<Member>[]>(
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
      { accessorKey: "planName", header: "Plan" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={STATUS_BADGE[row.original.status]} className="capitalize">
            {row.original.status}
          </Badge>
        ),
      },
      { accessorKey: "trainerName", header: "Trainer", cell: ({ row }) => row.original.trainerName ?? "—" },
      {
        accessorKey: "joinedOn",
        header: "Joined",
        cell: ({ row }) => new Date(row.original.joinedOn).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const member = row.original;
          if (!can(["members:write", "members:delete"])) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {can("members:write") && (
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingMember(member);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {can("members:delete") && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeletingMember(member)}
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
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="members:write">
          <Button
            onClick={() => {
              setEditingMember(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No members yet"
        emptyDescription="Add your first member to get started."
        pageSize={10}
      />

      <MemberFormDialog open={formOpen} onOpenChange={setFormOpen} member={editingMember} />

      <ConfirmDialog
        open={Boolean(deletingMember)}
        onOpenChange={(open) => !open && setDeletingMember(undefined)}
        title={`Remove ${deletingMember?.name}?`}
        description="This will permanently remove this member's profile. This can't be undone."
        confirmLabel="Remove"
        isLoading={deleteMember.isPending}
        onConfirm={() => {
          if (!deletingMember) return;
          deleteMember.mutate(deletingMember.id, { onSuccess: () => setDeletingMember(undefined) });
        }}
      />
    </div>
  );
}
