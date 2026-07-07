import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarCheck,
  CreditCard,
  BadgeCheck,
  UtensilsCrossed,
  ClipboardList,
  CalendarClock,
  BarChart3,
  Bell,
  Megaphone,
  Settings,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { NavSection } from "@/types/nav.types";

/**
 * Single source of truth for the sidebar. Every item declares the permission(s)
 * required to see it; the Sidebar component filters this against the current
 * user's resolved permission set. Nothing here is role-specific — role
 * differences fall out of permission differences automatically.
 */
export const NAVIGATION: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.dashboard,
        icon: LayoutDashboard,
        requiredPermissions: ["dashboard:view"],
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        label: "Members",
        href: ROUTES.members,
        icon: Users,
        requiredPermissions: ["members:read"],
      },
      {
        label: "Trainers",
        href: ROUTES.trainers,
        icon: Dumbbell,
        requiredPermissions: ["trainers:read"],
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Attendance",
        href: ROUTES.attendance,
        icon: CalendarCheck,
        requiredPermissions: ["attendance:read"],
      },
      {
        label: "Payments",
        href: ROUTES.payments,
        icon: CreditCard,
        requiredPermissions: ["payments:read"],
      },
      {
        label: "Memberships",
        href: ROUTES.memberships,
        icon: BadgeCheck,
        requiredPermissions: ["memberships:read"],
      },
      {
        label: "Sessions",
        href: ROUTES.sessions,
        icon: CalendarClock,
        requiredPermissions: ["sessions:read"],
      },
    ],
  },
  {
    title: "Programs",
    items: [
      {
        label: "Meal Plans",
        href: ROUTES.mealPlans,
        icon: UtensilsCrossed,
        requiredPermissions: ["meal-plans:read"],
      },
      {
        label: "Workout Plans",
        href: ROUTES.workoutPlans,
        icon: ClipboardList,
        requiredPermissions: ["workout-plans:read"],
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        label: "Reports",
        href: ROUTES.reports,
        icon: BarChart3,
        requiredPermissions: ["reports:read"],
      },
      {
        label: "Notifications",
        href: ROUTES.notifications,
        icon: Bell,
        requiredPermissions: ["notifications:read"],
      },
      {
        label: "Notice Board",
        href: ROUTES.noticeBoard,
        icon: Megaphone,
        requiredPermissions: ["notice-board:read"],
      },
    ],
  },
  {
    items: [
      {
        label: "Settings",
        href: ROUTES.settings,
        icon: Settings,
        requiredPermissions: ["settings:read"],
      },
    ],
  },
];
