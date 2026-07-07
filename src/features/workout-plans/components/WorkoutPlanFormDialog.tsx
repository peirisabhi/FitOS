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
import { workoutPlanFormSchema, type WorkoutPlanFormValues } from "@/features/workout-plans/schemas";
import { useCreateWorkoutPlan, useUpdateWorkoutPlan } from "@/features/workout-plans/hooks";
import type { WorkoutPlan } from "@/features/workout-plans/types";

export interface WorkoutPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutPlan?: WorkoutPlan;
}

export function WorkoutPlanFormDialog({ open, onOpenChange, workoutPlan }: WorkoutPlanFormDialogProps) {
  const isEditing = Boolean(workoutPlan);
  const createWorkoutPlan = useCreateWorkoutPlan();
  const updateWorkoutPlan = useUpdateWorkoutPlan();
  const isPending = createWorkoutPlan.isPending || updateWorkoutPlan.isPending;

  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanFormSchema),
    defaultValues: { memberName: "", planName: "", focus: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        workoutPlan
          ? { memberName: workoutPlan.memberName, planName: workoutPlan.planName, focus: workoutPlan.focus }
          : { memberName: "", planName: "", focus: "" },
      );
    }
  }, [open, workoutPlan, form]);

  async function onSubmit(values: WorkoutPlanFormValues) {
    if (isEditing && workoutPlan) {
      await updateWorkoutPlan.mutateAsync({ id: workoutPlan.id, dto: values });
    } else {
      await createWorkoutPlan.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit workout plan" : "Assign workout plan"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this member's training program." : "Assign a training program to a member."}
          </DialogDescription>
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
              name="planName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lean & Strong — Phase 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus</FormLabel>
                  <FormControl>
                    <Input placeholder="Upper body strength + conditioning" {...field} />
                  </FormControl>
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
                {isEditing ? "Save changes" : "Assign plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
