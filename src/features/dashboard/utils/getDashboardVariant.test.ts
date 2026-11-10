import { describe, expect, it } from "vitest";
import { getDashboardVariant } from "@/features/dashboard/utils/getDashboardVariant";

describe("getDashboardVariant", () => {
  it.each([["super_admin"], ["owner"], ["manager"], ["receptionist"]] as const)(
    "resolves the 'owner' (staff) variant for %s",
    (role) => {
      expect(getDashboardVariant([role])).toBe("owner");
    },
  );

  it("resolves the 'trainer' variant for a trainer with no staff role", () => {
    expect(getDashboardVariant(["trainer"])).toBe("trainer");
  });

  it("resolves the 'member' variant for a plain member", () => {
    expect(getDashboardVariant(["member"])).toBe("member");
  });

  it("falls back to 'member' when there are no roles at all", () => {
    expect(getDashboardVariant([])).toBe("member");
  });

  it("prioritizes staff over trainer for multi-role users", () => {
    expect(getDashboardVariant(["trainer", "manager"])).toBe("owner");
  });

  it("prioritizes trainer over member for multi-role users", () => {
    expect(getDashboardVariant(["member", "trainer"])).toBe("trainer");
  });
});
