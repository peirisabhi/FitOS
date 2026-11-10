import { test, expect } from "@playwright/test";

async function loginAs(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * RBAC/PBAC end-to-end checks — the middleware guard and the sidebar's
 * permission filtering are two independent code paths (architecture doc
 * §4/§8) that are both supposed to reach the same conclusion. These tests
 * catch the case where one drifts from the other.
 */
test.describe("Role-based access", () => {
  test("a member cannot reach /settings and is redirected to 403", async ({ page }) => {
    await loginAs(page, "member@gymos.com", "Member@123");

    await page.goto("/settings");
    await expect(page).toHaveURL(/\/403/);
    await expect(page.getByText("You don't have access to this page")).toBeVisible();
  });

  test("a member's sidebar never renders a Settings link", async ({ page }) => {
    await loginAs(page, "member@gymos.com", "Member@123");
    await expect(page.getByRole("link", { name: "Settings" })).toHaveCount(0);
  });

  test("an owner can reach /settings and edit organization settings", async ({ page }) => {
    await loginAs(page, "owner@gymos.com", "Owner@123");

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/settings/);
    await page.getByRole("tab", { name: "Organization" }).click();
    await expect(page.getByLabel("Organization name")).toBeEnabled();
  });

  test("a manager sees Settings as read-only (settings:read but not settings:write)", async ({
    page,
  }) => {
    await loginAs(page, "manager@gymos.com", "Manager@123");

    await page.goto("/settings");
    await expect(page).toHaveURL(/\/settings/);
    await page.getByRole("tab", { name: "Organization" }).click();
    await expect(page.getByLabel("Organization name")).toBeDisabled();
  });

  test("a trainer can see Members (read-only) but not Trainers management delete/add controls implied by lacking write", async ({
    page,
  }) => {
    await loginAs(page, "trainer@gymos.com", "Trainer@123");

    await page.getByRole("link", { name: "Members" }).click();
    await expect(page).toHaveURL(/\/members/);
    await expect(page.getByRole("button", { name: "Add Member" })).toHaveCount(0);
  });
});
