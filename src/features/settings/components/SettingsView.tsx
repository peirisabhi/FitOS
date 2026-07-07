"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/features/settings/components/ProfileSettingsForm";
import { OrganizationSettingsForm } from "@/features/settings/components/OrganizationSettingsForm";
import { AppearanceSettings } from "@/features/settings/components/AppearanceSettings";
import { NotificationPreferencesForm } from "@/features/settings/components/NotificationPreferencesForm";

export function SettingsView() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="organization">Organization</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4">
        <ProfileSettingsForm />
      </TabsContent>
      <TabsContent value="organization" className="mt-4">
        <OrganizationSettingsForm />
      </TabsContent>
      <TabsContent value="appearance" className="mt-4">
        <AppearanceSettings />
      </TabsContent>
      <TabsContent value="notifications" className="mt-4">
        <NotificationPreferencesForm />
      </TabsContent>
    </Tabs>
  );
}
