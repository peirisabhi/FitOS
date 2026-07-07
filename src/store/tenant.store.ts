import { create } from "zustand";
import type { Tenant } from "@/types/tenant.types";

interface TenantState {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
}

/** Active tenant context — separate slice so future tenant-switching (multi-org users) doesn't touch auth state. */
export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  setTenant: (tenant) => set({ tenant }),
}));
