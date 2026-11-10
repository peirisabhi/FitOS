import { describe, expect, it } from "vitest";
import { resolvePermissions, hasPermission } from "@/lib/permissions";

describe("resolvePermissions", () => {
  it("returns the full permission set for a single role", () => {
    const permissions = resolvePermissions(["member"]);
    expect(permissions.has("dashboard:view")).toBe(true);
    expect(permissions.has("meal-plans:read")).toBe(true);
    expect(permissions.has("members:write")).toBe(false);
  });

  it("unions permissions across multiple roles instead of overwriting", () => {
    const trainerOnly = resolvePermissions(["trainer"]);
    const receptionistOnly = resolvePermissions(["receptionist"]);
    const both = resolvePermissions(["trainer", "receptionist"]);

    // Every permission either role has alone must survive the union.
    for (const permission of trainerOnly) {
      expect(both.has(permission)).toBe(true);
    }
    for (const permission of receptionistOnly) {
      expect(both.has(permission)).toBe(true);
    }
  });

  it("grants super_admin every permission that exists", () => {
    const superAdmin = resolvePermissions(["super_admin"]);
    const owner = resolvePermissions(["owner"]);
    for (const permission of owner) {
      expect(superAdmin.has(permission)).toBe(true);
    }
    expect(superAdmin.has("org:manage")).toBe(true);
  });

  it("returns an empty set for no roles", () => {
    expect(resolvePermissions([]).size).toBe(0);
  });
});

describe("hasPermission", () => {
  it("returns true when the granted set contains the single required permission", () => {
    const granted = new Set(["members:read", "members:write"] as const);
    expect(hasPermission(granted, "members:read")).toBe(true);
    expect(hasPermission(granted, "members:delete")).toBe(false);
  });

  it("treats an array of required permissions as OR, not AND", () => {
    const granted = new Set(["payments:read"] as const);
    expect(hasPermission(granted, ["payments:read", "payments:write"])).toBe(true);
    expect(hasPermission(granted, ["payments:write", "org:manage"])).toBe(false);
  });

  it("accepts a plain array of granted permissions, not just a Set", () => {
    expect(hasPermission(["sessions:read"], "sessions:read")).toBe(true);
    expect(hasPermission(["sessions:read"], "sessions:write")).toBe(false);
  });
});
