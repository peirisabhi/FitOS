"use client";

import { useState } from "react";
import { MoreHorizontal, Pin, PinOff, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { QueryBoundary } from "@/components/feedback";
import { ConfirmDialog } from "@/components/overlays";
import { RequirePermission } from "@/shared/components";
import { usePermission } from "@/hooks/usePermission";
import { useNotices, useDeleteNotice, useTogglePinNotice } from "@/features/notice-board/hooks";
import { NoticeFormDialog } from "@/features/notice-board/components/NoticeFormDialog";
import type { Notice } from "@/features/notice-board/types";

const AUDIENCE_LABELS: Record<Notice["audience"], string> = {
  all: "Everyone",
  staff: "Staff",
  members: "Members",
};

export function NoticeBoardList() {
  const { can } = usePermission();
  const { data, isLoading, isError, refetch } = useNotices({ pageSize: 100 });
  const [formOpen, setFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | undefined>(undefined);
  const [deletingNotice, setDeletingNotice] = useState<Notice | undefined>(undefined);
  const togglePin = useTogglePinNotice();
  const deleteNotice = useDeleteNotice();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RequirePermission permission="notice-board:write">
          <Button
            onClick={() => {
              setEditingNotice(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Post Announcement
          </Button>
        </RequirePermission>
      </div>

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        data={data}
        onRetry={() => refetch()}
        isEmpty={(d) => d.items.length === 0}
        errorTitle="Couldn't load announcements"
        loadingFallback={
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
            ))}
          </div>
        }
      >
        {(result) => (
          <div className="space-y-3">
            {result.items.map((notice) => (
              <Card key={notice.id}>
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {notice.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                      <p className="font-medium">{notice.title}</p>
                      <Badge variant="secondary">{AUDIENCE_LABELS[notice.audience]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{notice.body}</p>
                    <p className="text-xs text-muted-foreground">
                      Posted {new Date(notice.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {can("notice-board:write") && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Announcement actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => togglePin.mutate({ id: notice.id, pinned: !notice.pinned })}
                        >
                          {notice.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                          {notice.pinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingNotice(notice);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeletingNotice(notice)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </QueryBoundary>

      <NoticeFormDialog open={formOpen} onOpenChange={setFormOpen} notice={editingNotice} />

      <ConfirmDialog
        open={Boolean(deletingNotice)}
        onOpenChange={(open) => !open && setDeletingNotice(undefined)}
        title={`Remove "${deletingNotice?.title}"?`}
        description="This will permanently remove this announcement. This can't be undone."
        confirmLabel="Remove"
        isLoading={deleteNotice.isPending}
        onConfirm={() => {
          if (!deletingNotice) return;
          deleteNotice.mutate(deletingNotice.id, { onSuccess: () => setDeletingNotice(undefined) });
        }}
      />
    </div>
  );
}
