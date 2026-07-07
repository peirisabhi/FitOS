"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QueryBoundary } from "@/components/feedback";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/features/settings/hooks";
import type { NotificationPreferences } from "@/features/settings/types";

const ROWS: Array<{ key: keyof NotificationPreferences; label: string; description: string }> = [
  { key: "emailEnabled", label: "Email notifications", description: "Payment receipts, membership renewals, announcements." },
  { key: "smsEnabled", label: "SMS reminders", description: "Upcoming session and class reminders." },
  { key: "pushEnabled", label: "Push notifications", description: "Real-time alerts when using the mobile app." },
];

export function NotificationPreferencesForm() {
  const { data, isLoading, isError, refetch } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>Choose which notifications you'd like to receive.</CardDescription>
      </CardHeader>
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        data={data}
        onRetry={() => refetch()}
        loadingFallback={<CardContent className="text-sm text-muted-foreground">Loading...</CardContent>}
      >
        {(prefs) => (
          <>
            <CardContent className="max-w-md space-y-4">
              {ROWS.map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor={row.key}>{row.label}</Label>
                    <p className="text-xs text-muted-foreground">{row.description}</p>
                  </div>
                  <Switch
                    id={row.key}
                    checked={prefs[row.key]}
                    onCheckedChange={(checked) => updatePreferences.mutate({ ...prefs, [row.key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
            {updatePreferences.isPending && (
              <CardFooter>
                <Button variant="ghost" disabled>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </Button>
              </CardFooter>
            )}
          </>
        )}
      </QueryBoundary>
    </Card>
  );
}
