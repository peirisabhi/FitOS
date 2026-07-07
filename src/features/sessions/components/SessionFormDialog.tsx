"use client";

import { useEffect } from "react";
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
import { sessionFormSchema, type SessionFormValues } from "@/features/sessions/schemas";
import { useCreateSession } from "@/features/sessions/hooks";
import { SESSION_TYPES } from "@/features/sessions/types";

const TYPE_LABELS: Record<(typeof SESSION_TYPES)[number], string> = {
  class: "Group Class",
  personal: "Personal Training",
};

function toIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function SessionFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createSession = useCreateSession();

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      title: "",
      type: "class",
      trainerName: "",
      memberName: "",
      location: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const sessionType = form.watch("type");

  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        type: "class",
        trainerName: "",
        memberName: "",
        location: "",
        date: new Date().toISOString().slice(0, 10),
        startTime: "09:00",
        endTime: "10:00",
      });
    }
  }, [open, form]);

  async function onSubmit(values: SessionFormValues) {
    await createSession.mutateAsync({
      title: values.title,
      type: values.type,
      trainerName: values.trainerName,
      memberName: values.type === "personal" ? values.memberName : undefined,
      location: values.location,
      start: toIso(values.date, values.startTime),
      end: toIso(values.date, values.endTime),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule session</DialogTitle>
          <DialogDescription>Book a class or personal training session.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SESSION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="HIIT Group Class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer</FormLabel>
                  <FormControl>
                    <Input placeholder="Diego Alvarez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {sessionType === "personal" && (
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
            )}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Studio A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createSession.isPending}>
                {createSession.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Schedule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
