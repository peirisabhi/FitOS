import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Set a new password</h2>
        <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
      </div>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
