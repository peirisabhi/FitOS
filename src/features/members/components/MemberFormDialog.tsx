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
import { memberFormSchema, type MemberFormValues } from "@/features/members/schemas";
import { useCreateMember, useUpdateMember } from "@/features/members/hooks";
import type { Member } from "@/features/members/types";

const PLAN_OPTIONS = ["Monthly Basic", "Monthly Plus", "Quarterly", "Annual Elite", "Day Pass"];

export interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present => edit mode; absent => create mode. */
  member?: Member;
}

export function MemberFormDialog({ open, onOpenChange, member }: MemberFormDialogProps) {
  const isEditing = Boolean(member);
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const isPending = createMember.isPending || updateMember.isPending;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: { name: "", email: "", phone: "", planName: PLAN_OPTIONS[0], trainerName: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        member
          ? { name: member.name, email: member.email, phone: member.phone, planName: member.planName, trainerName: member.trainerName ?? "" }
          : { name: "", email: "", phone: "", planName: PLAN_OPTIONS[0], trainerName: "" },
      );
    }
  }, [open, member, form]);

  async function onSubmit(values: MemberFormValues) {
    if (isEditing && member) {
      await updateMember.mutateAsync({ id: member.id, dto: values });
    } else {
      await createMember.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit member" : "Add member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this member's profile and plan." : "Create a new member profile."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jordan Blake" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jordan@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555-0100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="planName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLAN_OPTIONS.map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
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
                {isEditing ? "Save changes" : "Add member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
