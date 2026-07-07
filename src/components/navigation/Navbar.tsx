"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Settings, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/features/auth";
import { usePermission } from "@/hooks/usePermission";
import { NAVIGATION } from "@/config/navigation.config";
import { ROUTES } from "@/constants/routes";
import { ROLE_LABELS } from "@/types/role.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const { can } = usePermission();
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    toast.success("Signed out.");
    router.push(ROUTES.login);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="flex h-full flex-col gap-4 overflow-y-auto p-4">
            {NAVIGATION.map((section, i) => {
              const items = section.items.filter((item) => can(item.requiredPermissions));
              if (items.length === 0) return null;
              return (
                <div key={section.title ?? i} className="space-y-1">
                  {section.title && (
                    <p className="px-2 text-xs font-medium uppercase text-muted-foreground">{section.title}</p>
                  )}
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <Breadcrumb />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{user ? initials(user.name) : "?"}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
              {user?.roles.length ? (
                <Badge variant="secondary" className="mt-1.5">
                  {ROLE_LABELS[user.roles[0]!]}
                </Badge>
              ) : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ROUTES.settings}>
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.settings}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
