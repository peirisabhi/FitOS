import { Wrench } from "lucide-react";

export function Maintenance() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Wrench className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold">GymOS is undergoing scheduled maintenance</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          We&apos;ll be back shortly. Thanks for your patience.
        </p>
      </div>
    </div>
  );
}
