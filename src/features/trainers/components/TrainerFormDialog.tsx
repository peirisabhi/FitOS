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
import { trainerFormSchema, type TrainerFormValues } from "@/features/trainers/schemas";
import { useCreateTrainer, useUpdateTrainer } from "@/features/trainers/hooks";
import type { Trainer } from "@/features/trainers/types";

const SPECIALTY_OPTIONS = ["Strength Training", "HIIT", "Yoga", "Nutrition Coaching", "Mobility", "CrossFit"];

export interface TrainerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainer?: Trainer;
}

export function TrainerFormDialog({ open, onOpenChange, trainer }: TrainerFormDialogProps) {
  const isEditing = Boolean(trainer);
  const createTrainer = useCreateTrainer();
  const updateTrainer = useUpdateTrainer();
  const isPending = createTrainer.isPending || updateTrainer.isPending;

  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: { name: "", email: "", phone: "", specialty: SPECIALTY_OPTIONS[0] },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        trainer
          ? { name: trainer.name, email: trainer.email, phone: trainer.phone, specialty: trainer.specialty }
          : { name: "", email: "", phone: "", specialty: SPECIALTY_OPTIONS[0] },
      );
    }
  }, [open, trainer, form]);

  async function onSubmit(values: TrainerFormValues) {
    if (isEditing && trainer) {
      await updateTrainer.mutateAsync({ id: trainer.id, dto: values });
    } else {
      await createTrainer.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit trainer" : "Add trainer"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this trainer's profile and specialty." : "Create a new trainer profile."}
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
                    <Input placeholder="Diego Alvarez" {...field} />
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
                    <Input type="email" placeholder="diego@gymos.com" {...field} />
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
                    <Input placeholder="+1 555-0200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPECIALTY_OPTIONS.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
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
                {isEditing ? "Save changes" : "Add trainer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
