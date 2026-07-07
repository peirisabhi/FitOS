"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { NAVIGATION } from "@/config/navigation.config";
import { usePermission } from "@/hooks/usePermission";
import { useUiStore } from "@/store/ui.store";

/** Cmd+K / Ctrl+K global search over permitted navigation destinations. */
export function CommandPalette() {
  const router = useRouter();
  const { can } = usePermission();
  const isOpen = useUiStore((s) => s.isCommandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!isOpen);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, setOpen]);

  const items = NAVIGATION.flatMap((section) => section.items).filter((item) => can(item.requiredPermissions));

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {items.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => {
                router.push(item.href);
                setOpen(false);
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
