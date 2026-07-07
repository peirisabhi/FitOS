"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { ROUTES } from "@/constants/routes";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { ApiError } from "@/types/api.types";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEYS.rememberedEmail) ?? "" : "",
      password: "",
      rememberMe: typeof window !== "undefined" && !!window.localStorage.getItem(STORAGE_KEYS.rememberedEmail),
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await mutateAsync(values);

      if (values.rememberMe) {
        window.localStorage.setItem(STORAGE_KEYS.rememberedEmail, values.email);
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.rememberedEmail);
      }

      toast.success("Welcome back.");
      const next = searchParams.get("next") ?? ROUTES.dashboard;
      router.push(next);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    }
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <a href={ROUTES.forgotPassword} className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="rememberMe" />
              </FormControl>
              <FormLabel htmlFor="rememberMe" className="cursor-pointer font-normal">
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
