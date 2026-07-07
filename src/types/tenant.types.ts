/**
 * Multi-tenancy is modeled from day one (see architecture doc §1.8) even
 * though the mock backend only ever seeds a single tenant. Every session
 * and repository query carries a tenantId so scoping isn't a retrofit later.
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "growth" | "enterprise";
  logoUrl?: string;
}
