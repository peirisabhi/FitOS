import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Reset your password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href={ROUTES.login} className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
