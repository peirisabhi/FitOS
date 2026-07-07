"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QueryBoundary } from "@/components/feedback";
import { usePermission } from "@/hooks/usePermission";
import { organizationFormSchema, type OrganizationFormValues } from "@/features/settings/schemas";
import { useOrganizationSettings, useUpdateOrganization } from "@/features/settings/hooks";

export function OrganizationSettingsForm() {
  const { can } = usePermission();
  const canEdit = can("settings:write");
  const { data, isLoading, isError, refetch } = useOrganizationSettings();
  const updateOrganization = useUpdateOrganization();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: { tenantName: "" },
  });

  useEffect(() => {
    if (data) form.reset({ tenantName: data.tenantName });
  }, [data, form]);

  async function onSubmit(values: OrganizationFormValues) {
    await updateOrganization.mutateAsync(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <CardDescription>
          {canEdit ? "Manage your gym's name and plan." : "View-only — ask an owner to make changes."}
        </CardDescription>
      </CardHeader>
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        data={data}
        onRetry={() => refetch()}
        loadingFallback={<CardContent className="text-sm text-muted-foreground">Loading...</CardContent>}
      >
        {(org) => (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tenantName"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel>Organization name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!canEdit} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="max-w-sm space-y-1">
                  <Label>Plan</Label>
                  <div>
                    <Badge variant="secondary" className="capitalize">
                      {org.plan}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              {canEdit && (
                <CardFooter>
                  <Button type="submit" disabled={updateOrganization.isPending}>
                    {updateOrganization.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        )}
      </QueryBoundary>
    </Card>
  );
}
