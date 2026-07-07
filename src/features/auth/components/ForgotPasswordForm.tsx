"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas";
import { useForgotPassword } from "@/features/auth/hooks";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await mutateAsync(values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/40 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        <p className="text-sm text-muted-foreground">
          If that email exists in our system, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@gym.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>
    </Form>
  );
}
