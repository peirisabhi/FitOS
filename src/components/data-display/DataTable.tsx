"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  type ColumnDef,
  type Table as ReactTableInstance,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  /** Enable client-side pagination (server-driven pagination can bypass this). Ignored when `virtualize` is on. */
  pageSize?: number;
  /**
   * Row-virtualize instead of paginating — for datasets too large to
   * comfortably paginate (hundreds+ of rows). Renders every sorted row
   * inside a fixed-height scroll container, only mounting the rows
   * currently in (or near) the viewport. The column-def contract is
   * unchanged; this is purely a rendering-strategy swap (architecture
   * doc §"Performance" — the seam flagged back in Milestone 1).
   */
  virtualize?: boolean;
  /** Scroll container height in px when `virtualize` is on. */
  virtualizedHeight?: number;
}

/**
 * The one table implementation every list page uses. Column defs are the
 * per-feature customization point; sorting/pagination/empty/error/loading
 * states are handled once, here (architecture doc §5).
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
  virtualize = false,
  virtualizedHeight = 480,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: virtualize ? undefined : getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  if (isLoading) return <TableSkeleton columns={columns.length} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (data.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  const headerRow = (
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
  );

  if (virtualize) {
    return (
      <VirtualizedBody
        table={table}
        headerRow={headerRow}
        columnCount={columns.length}
        height={virtualizedHeight}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border">
        <Table>
          {headerRow}
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
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

interface VirtualizedBodyProps<TData> {
  table: ReactTableInstance<TData>;
  headerRow: ReactNode;
  columnCount: number;
  height: number;
}

/** Row-virtualized rendering path — kept separate so the non-virtualized path above stays simple to read. */
function VirtualizedBody<TData>({
  table,
  headerRow,
  columnCount,
  height,
}: VirtualizedBodyProps<TData>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 12,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]!.start : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1]!.end : 0;

  return (
    <div className="rounded-lg border">
      <div ref={parentRef} style={{ height, overflow: "auto" }}>
        <Table>
          {headerRow}
          <TableBody>
            {paddingTop > 0 && (
              <tr aria-hidden>
                <td style={{ height: paddingTop }} colSpan={columnCount} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]!;
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {paddingBottom > 0 && (
              <tr aria-hidden>
                <td style={{ height: paddingBottom }} colSpan={columnCount} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
