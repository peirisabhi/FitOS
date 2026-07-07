"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, SunMoon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: SunMoon },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose how GymOS looks on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid max-w-sm grid-cols-3 gap-3">
          {OPTIONS.map((option) => {
            const isActive = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                  isActive ? "border-primary bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <option.icon className="h-5 w-5" />
                {option.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
