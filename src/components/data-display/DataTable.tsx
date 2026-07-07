"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/navigation/Pagination";
import { TableSkeleton } from "@/components/feedback/Skeletons";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Enable client-side pagination (server-driven pagination can bypass this). */
  pageSize?: number;
}

/**
 * The one table implementation every list page uses. Column defs are the
 * per-feature customization point; sorting/pagination/empty/error/loading
 * states are handled once, here (architecture doc §5).
 *
 * NOTE: for very large datasets, swap `getCoreRowModel` usage for
 * `@tanstack/react-virtual` row virtualization — the column-def contract
 * stays identical, so that's a Milestone 5 performance change, not a
 * rewrite.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No results",
  emptyDescription = "There's nothing to show with the current filters.",
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  if (isLoading) return <TableSkeleton columns={columns.length} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (data.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-1 disabled:cursor-default"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort &&
                            (sortDir === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : sortDir === "desc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-40" />
                            ))}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={table.getState().pagination.pageIndex + 1}
        pageCount={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />
    </div>
  );
}
