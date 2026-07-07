import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
}

export function Pagination({ page, pageCount, onPageChange, canPreviousPage, canNextPage }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={canPreviousPage === false}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={canNextPage === false}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
