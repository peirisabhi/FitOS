import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

/**
 * Pure client/UI state — never server data (see architecture doc §1.2 / §6).
 * Persisted so sidebar collapse survives a refresh; this is in-memory
 * zustand persist (localStorage under the hood via the browser, not a
 * hand-rolled localStorage call inside a component).
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isCommandPaletteOpen: false,
      toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    }),
    { name: "gymos.ui-preferences", partialize: (s) => ({ isSidebarCollapsed: s.isSidebarCollapsed }) },
  ),
);
