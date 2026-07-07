"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/constants/routes";

function toLabel(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Route-driven breadcrumb — never hand-authored per page. */
export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => ({
    label: toLabel(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href={ROUTES.dashboard} className="flex items-center hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
