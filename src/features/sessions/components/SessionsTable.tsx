"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
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
import { useSessions, useCancelSession, useDeleteSession } from "@/features/sessions/hooks";
import { SessionFormDialog } from "@/features/sessions/components/SessionFormDialog";
import type { GymSession, SessionStatus } from "@/features/sessions/types";

const STATUS_BADGE: Record<SessionStatus, "success" | "secondary" | "destructive"> = {
  scheduled: "success",
  completed: "secondary",
  cancelled: "destructive",
};

export function SessionsTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState<GymSession | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useSessions({ search: debouncedSearch, pageSize: 500 });
  const cancelSession = useCancelSession();
  const deleteSession = useDeleteSession();

  const columns = useMemo<ColumnDef<GymSession>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Session",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.trainerName}
              {row.original.memberName ? ` · ${row.original.memberName}` : ""}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "start",
        header: "When",
        cell: ({ row }) =>
          new Date(row.original.start).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
      },
      { accessorKey: "location", header: "Location" },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <span className="capitalize">{row.original.type === "class" ? "Class" : "Personal"}</span>,
      },
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
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const session = row.original;
          if (!can("sessions:write")) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session.status === "scheduled" && (
                  <DropdownMenuItem onClick={() => cancelSession.mutate(session.id)}>
                    <Ban className="h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeletingSession(session)}
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
    [can, cancelSession],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="sessions:write">
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Schedule Session
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No sessions scheduled"
        emptyDescription="Schedule your first class or personal training session."
        pageSize={10}
      />

      <SessionFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={Boolean(deletingSession)}
        onOpenChange={(open) => !open && setDeletingSession(undefined)}
        title={`Remove ${deletingSession?.title}?`}
        description="This will permanently remove this session. This can't be undone."
        confirmLabel="Remove"
        isLoading={deleteSession.isPending}
        onConfirm={() => {
          if (!deletingSession) return;
          deleteSession.mutate(deletingSession.id, { onSuccess: () => setDeletingSession(undefined) });
        }}
      />
    </div>
  );
}
