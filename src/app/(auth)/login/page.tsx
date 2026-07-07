import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your GymOS account.</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>

      <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">Demo accounts</p>
        <p>admin@gymos.com · owner@gymos.com · manager@gymos.com</p>
        <p>trainer@gymos.com · reception@gymos.com · member@gymos.com</p>
        <p className="mt-1">Password pattern: Role@123 (e.g. Owner@123)</p>
      </div>
    </div>
  );
}
