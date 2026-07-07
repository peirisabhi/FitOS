"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { LogOut, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
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
import { useAttendance, useCheckOut, useDeleteAttendance } from "@/features/attendance/hooks";
import { CheckInDialog } from "@/features/attendance/components/CheckInDialog";
import type { AttendanceRecord } from "@/features/attendance/types";

function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function AttendanceTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<AttendanceRecord | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useAttendance({ search: debouncedSearch, pageSize: 500 });
  const checkOut = useCheckOut();
  const deleteRecord = useDeleteAttendance();

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      { accessorKey: "memberName", header: "Member" },
      { accessorKey: "checkInAt", header: "Check-in", cell: ({ row }) => formatTime(row.original.checkInAt) },
      { accessorKey: "checkOutAt", header: "Check-out", cell: ({ row }) => formatTime(row.original.checkOutAt) },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => <span className="capitalize">{row.original.method}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "checked-in" ? "success" : "secondary"} className="capitalize">
            {row.original.status.replace("-", " ")}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const record = row.original;
          if (!can("attendance:write")) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {record.status === "checked-in" && (
                  <DropdownMenuItem onClick={() => checkOut.mutate(record.id)}>
                    <LogOut className="h-4 w-4" />
                    Check out
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeletingRecord(record)}
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
    [can, checkOut],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="attendance:write">
          <Button onClick={() => setCheckInOpen(true)}>
            <Plus className="h-4 w-4" />
            Log Check-in
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No check-ins yet"
        emptyDescription="Log your first check-in to get started."
        pageSize={10}
      />

      <CheckInDialog open={checkInOpen} onOpenChange={setCheckInOpen} />

      <ConfirmDialog
        open={Boolean(deletingRecord)}
        onOpenChange={(open) => !open && setDeletingRecord(undefined)}
        title={`Remove this check-in record?`}
        description={`This will permanently remove ${deletingRecord?.memberName}'s attendance record. This can't be undone.`}
        confirmLabel="Remove"
        isLoading={deleteRecord.isPending}
        onConfirm={() => {
          if (!deletingRecord) return;
          deleteRecord.mutate(deletingRecord.id, { onSuccess: () => setDeletingRecord(undefined) });
        }}
      />
    </div>
  );
}
