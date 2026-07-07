"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { noticeFormSchema, type NoticeFormValues } from "@/features/notice-board/schemas";
import { useCreateNotice, useUpdateNotice } from "@/features/notice-board/hooks";
import { NOTICE_AUDIENCES, type Notice } from "@/features/notice-board/types";

const AUDIENCE_LABELS: Record<(typeof NOTICE_AUDIENCES)[number], string> = {
  all: "Everyone",
  staff: "Staff only",
  members: "Members only",
};

export interface NoticeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice?: Notice;
}

export function NoticeFormDialog({ open, onOpenChange, notice }: NoticeFormDialogProps) {
  const isEditing = Boolean(notice);
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const isPending = createNotice.isPending || updateNotice.isPending;

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: { title: "", body: "", audience: "all" },
  });

  useEffect(() => {
    if (open) {
      form.reset(notice ? { title: notice.title, body: notice.body, audience: notice.audience } : { title: "", body: "", audience: "all" });
    }
  }, [open, notice, form]);

  async function onSubmit(values: NoticeFormValues) {
    if (isEditing && notice) {
      await updateNotice.mutateAsync({ id: notice.id, dto: values });
    } else {
      await createNotice.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit announcement" : "Post announcement"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this announcement." : "Share an update with your gym."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="New yoga classes starting Monday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share the details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Who should see this?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NOTICE_AUDIENCES.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {AUDIENCE_LABELS[audience]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Save changes" : "Post announcement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
