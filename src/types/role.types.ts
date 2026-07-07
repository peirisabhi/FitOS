/**
 * Canonical role identifiers. This is the ONLY place roles are enumerated —
 * everything else (permission matrix, navigation, mock users, seed fixtures)
 * derives from or references this union.
 */
export const ROLES = [
  "super_admin",
  "owner",
  "manager",
  "trainer",
  "receptionist",
  "member",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  owner: "Owner",
  manager: "Manager",
  trainer: "Trainer",
  receptionist: "Receptionist",
  member: "Member",
};
