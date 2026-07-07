"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { checkInFormSchema, type CheckInFormValues } from "@/features/attendance/schemas";
import { useCheckIn } from "@/features/attendance/hooks";
import { CHECK_IN_METHODS } from "@/features/attendance/types";

const METHOD_LABELS: Record<(typeof CHECK_IN_METHODS)[number], string> = {
  qr: "QR Code",
  manual: "Manual",
  biometric: "Biometric",
};

export function CheckInDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const checkIn = useCheckIn();

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInFormSchema),
    defaultValues: { memberName: "", method: "manual" },
  });

  async function onSubmit(values: CheckInFormValues) {
    await checkIn.mutateAsync(values);
    form.reset({ memberName: "", method: "manual" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log check-in</DialogTitle>
          <DialogDescription>Record a member's arrival at the front desk.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <FormControl>
                    <Input placeholder="Jordan Blake" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select check-in method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CHECK_IN_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {METHOD_LABELS[method]}
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
              <Button type="submit" disabled={checkIn.isPending}>
                {checkIn.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Check in
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
