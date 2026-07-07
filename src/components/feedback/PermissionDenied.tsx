import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function PermissionDenied() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
        <ShieldAlert className="h-7 w-7 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold">You don&apos;t have access to this page</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your role doesn&apos;t include the permissions required here. Contact your gym owner or admin if you
          think this is a mistake.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.dashboard}>Back to dashboard</Link>
      </Button>
    </div>
  );
}
