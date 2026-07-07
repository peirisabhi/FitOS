"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
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
import { usePayments, useMarkPaymentPaid, useDeletePayment } from "@/features/payments/hooks";
import { PaymentFormDialog } from "@/features/payments/components/PaymentFormDialog";
import type { Payment, PaymentStatus } from "@/features/payments/types";

const STATUS_BADGE: Record<PaymentStatus, "success" | "warning" | "destructive" | "secondary"> = {
  paid: "success",
  pending: "warning",
  overdue: "destructive",
  refunded: "secondary",
};

export function PaymentsTable() {
  const { can } = usePermission();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<Payment | undefined>(undefined);

  const { data, isLoading, isError, refetch } = usePayments({ search: debouncedSearch, pageSize: 500 });
  const markPaid = useMarkPaymentPaid();
  const deletePayment = useDeletePayment();

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "memberName",
        header: "Member",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.memberName}</p>
            <p className="text-xs text-muted-foreground">{row.original.description}</p>
          </div>
        ),
      },
      { accessorKey: "amount", header: "Amount", cell: ({ row }) => `$${row.original.amount.toLocaleString()}` },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => <span className="capitalize">{row.original.method.replace("-", " ")}</span>,
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
        accessorKey: "dueOn",
        header: "Due",
        cell: ({ row }) => new Date(row.original.dueOn).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const payment = row.original;
          if (!can("payments:write")) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {payment.status !== "paid" && (
                  <DropdownMenuItem onClick={() => markPaid.mutate(payment.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as paid
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeletingPayment(payment)}
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
    [can, markPaid],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <RequirePermission permission="payments:write">
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </RequirePermission>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No payments yet"
        emptyDescription="Record your first payment to get started."
        pageSize={10}
      />

      <PaymentFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={Boolean(deletingPayment)}
        onOpenChange={(open) => !open && setDeletingPayment(undefined)}
        title="Remove this payment record?"
        description={`This will permanently remove the ${deletingPayment?.description} record for ${deletingPayment?.memberName}. This can't be undone.`}
        confirmLabel="Remove"
        isLoading={deletePayment.isPending}
        onConfirm={() => {
          if (!deletingPayment) return;
          deletePayment.mutate(deletingPayment.id, { onSuccess: () => setDeletingPayment(undefined) });
        }}
      />
    </div>
  );
}
