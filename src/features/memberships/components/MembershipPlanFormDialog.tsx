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
import { membershipPlanFormSchema, type MembershipPlanFormValues } from "@/features/memberships/schemas";
import { useCreateMembershipPlan, useUpdateMembershipPlan } from "@/features/memberships/hooks";
import { BILLING_CYCLES, type MembershipPlan } from "@/features/memberships/types";

const CYCLE_LABELS: Record<(typeof BILLING_CYCLES)[number], string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
  "one-time": "One-time",
};

export interface MembershipPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: MembershipPlan;
}

export function MembershipPlanFormDialog({ open, onOpenChange, plan }: MembershipPlanFormDialogProps) {
  const isEditing = Boolean(plan);
  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const isPending = createPlan.isPending || updatePlan.isPending;

  const form = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanFormSchema),
    defaultValues: { name: "", description: "", price: 0, billingCycle: "monthly", durationDays: 30 },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        plan
          ? {
              name: plan.name,
              description: plan.description ?? "",
              price: plan.price,
              billingCycle: plan.billingCycle,
              durationDays: plan.durationDays,
            }
          : { name: "", description: "", price: 0, billingCycle: "monthly", durationDays: 30 },
      );
    }
  }, [open, plan, form]);

  async function onSubmit(values: MembershipPlanFormValues) {
    if (isEditing && plan) {
      await updatePlan.mutateAsync({ id: plan.id, dto: values });
    } else {
      await createPlan.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit plan" : "Create plan"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this membership plan's pricing and terms." : "Define a new membership plan."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan name</FormLabel>
                  <FormControl>
                    <Input placeholder="Annual Elite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's included in this plan?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing cycle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billing cycle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BILLING_CYCLES.map((cycle) => (
                        <SelectItem key={cycle} value={cycle}>
                          {CYCLE_LABELS[cycle]}
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
                {isEditing ? "Save changes" : "Create plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
