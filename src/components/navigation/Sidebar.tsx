"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/config/navigation.config";
import { siteConfig } from "@/config/site.config";
import { usePermission } from "@/hooks/usePermission";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

/**
 * Config-driven sidebar: every entry in NAVIGATION is filtered against the
 * current user's resolved permissions. No role-specific sidebar variant
 * exists — role differences fall out of permission differences (architecture
 * doc §1.4 / §8).
 */
export function Sidebar() {
  const pathname = usePathname();
  const { can } = usePermission();
  const isCollapsed = useUiStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 248 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-sidebar text-sidebar-foreground hidden h-screen shrink-0 flex-col border-r md:flex"
      >
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold">
            G
          </div>
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold">{siteConfig.name}</span>
          )}
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {NAVIGATION.map((section, sectionIndex) => {
            const visibleItems = section.items.filter((item) => can(item.requiredPermissions));
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title ?? `section-${sectionIndex}`} className="space-y-1">
                {section.title && !isCollapsed && (
                  <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                    {section.title}
                  </p>
                )}
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  const link = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        isCollapsed && "justify-center",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }
                  return link;
                })}
              </div>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start gap-2")}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            {!isCollapsed && "Collapse"}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
