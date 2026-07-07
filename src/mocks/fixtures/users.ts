import type { Role } from "@/types/role.types";

/**
 * Mock credential store. Plaintext passwords here are intentional and
 * mock-only (see MOCK_SESSION_SECRET in .env.example) — this file is
 * never shipped against a real backend; it's swapped out entirely when
 * NEXT_PUBLIC_API_MODE=rest.
 */
export interface MockUserRecord {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  password: string;
  roles: Role[];
  avatarUrl?: string;
}

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "user_super_admin",
    tenantId: "tenant_1",
    name: "Ava Sinclair",
    email: "admin@gymos.com",
    password: "Admin@123",
    roles: ["super_admin"],
  },
  {
    id: "user_owner",
    tenantId: "tenant_1",
    name: "Marcus Reyes",
    email: "owner@gymos.com",
    password: "Owner@123",
    roles: ["owner"],
  },
  {
    id: "user_manager",
    tenantId: "tenant_1",
    name: "Priya Nair",
    email: "manager@gymos.com",
    password: "Manager@123",
    roles: ["manager"],
  },
  {
    id: "user_trainer",
    tenantId: "tenant_1",
    name: "Diego Alvarez",
    email: "trainer@gymos.com",
    password: "Trainer@123",
    roles: ["trainer"],
  },
  {
    id: "user_receptionist",
    tenantId: "tenant_1",
    name: "Hannah Lee",
    email: "reception@gymos.com",
    password: "Reception@123",
    roles: ["receptionist"],
  },
  {
    id: "user_member",
    tenantId: "tenant_1",
    name: "Jordan Blake",
    email: "member@gymos.com",
    password: "Member@123",
    roles: ["member"],
  },
];

export function findUserByEmail(email: string): MockUserRecord | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): MockUserRecord | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
