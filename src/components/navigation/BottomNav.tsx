"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/config/navigation.config";
import { usePermission } from "@/hooks/usePermission";

/** Mobile bottom nav — surfaces the first 4 permitted items; everything else lives behind the sidebar Sheet. */
export function BottomNav() {
  const pathname = usePathname();
  const { can } = usePermission();

  const items = NAVIGATION.flatMap((section) => section.items)
    .filter((item) => can(item.requiredPermissions))
    .slice(0, 4);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-16 flex-col items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
