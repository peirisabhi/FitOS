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
import { mealPlanFormSchema, type MealPlanFormValues } from "@/features/meal-plans/schemas";
import { useCreateMealPlan, useUpdateMealPlan } from "@/features/meal-plans/hooks";
import type { MealPlan } from "@/features/meal-plans/types";

export interface MealPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealPlan?: MealPlan;
}

export function MealPlanFormDialog({ open, onOpenChange, mealPlan }: MealPlanFormDialogProps) {
  const isEditing = Boolean(mealPlan);
  const createMealPlan = useCreateMealPlan();
  const updateMealPlan = useUpdateMealPlan();
  const isPending = createMealPlan.isPending || updateMealPlan.isPending;

  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealPlanFormSchema),
    defaultValues: { memberName: "", planName: "", dailyCalories: 2000 },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        mealPlan
          ? { memberName: mealPlan.memberName, planName: mealPlan.planName, dailyCalories: mealPlan.dailyCalories }
          : { memberName: "", planName: "", dailyCalories: 2000 },
      );
    }
  }, [open, mealPlan, form]);

  async function onSubmit(values: MealPlanFormValues) {
    if (isEditing && mealPlan) {
      await updateMealPlan.mutateAsync({ id: mealPlan.id, dto: values });
    } else {
      await createMealPlan.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit meal plan" : "Assign meal plan"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this member's nutrition plan." : "Assign a nutrition plan to a member."}
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
                    <Input placeholder="Lean Cut 2200 kcal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dailyCalories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily calories</FormLabel>
                  <FormControl>
                    <Input type="number" step={50} {...field} />
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
