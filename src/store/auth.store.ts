import { create } from "zustand";
import type { AuthUser } from "@/types/user.types";
import type { Permission } from "@/types/permission.types";
import { resolvePermissions } from "@/lib/permissions";

interface AuthState {
  user: AuthUser | null;
  permissions: Set<Permission>;
  /** Set once on hydration so guards don't flash a redirect before session check resolves. */
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setHydrated: () => void;
  clear: () => void;
}

/**
 * Auth store holds only the SESSION SNAPSHOT (who is signed in, their
 * resolved permissions) — never server data. Source of truth for "is the
 * user logged in" is still the session cookie / TanStack Query's session
 * query; this store is a fast, synchronous read for components like the
 * Sidebar that render before that query resolves on soft navigations.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  permissions: new Set(),
  isHydrated: false,
  setUser: (user) =>
    set({
      user,
      permissions: user ? resolvePermissions(user.roles) : new Set(),
    }),
  setHydrated: () => set({ isHydrated: true }),
  clear: () => set({ user: null, permissions: new Set() }),
}));
