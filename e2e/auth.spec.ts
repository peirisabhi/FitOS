import { test, expect } from "@playwright/test";

/**
 * End-to-end auth flow, running against the real app in mock mode (MSW
 * answers every request — see playwright.config.ts). Covers the parts a
 * component test can't: full page navigation, the middleware guard, and
 * the session actually persisting across a reload.
 */

test.describe("Authentication", () => {
  test("unauthenticated visitors are redirected to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("signs in with valid credentials and reaches the dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("owner@gymos.com");
    await page.getByLabel("Password").fill("Owner@123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /Welcome back, Marcus/ })).toBeVisible();
  });

  test("shows an error and stays on the login page for wrong credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("owner@gymos.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("session persists across a full page reload", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("owner@gymos.com");
    await page.getByLabel("Password").fill("Owner@123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /Welcome back, Marcus/ })).toBeVisible();
  });

  test("logging out clears the session and returns to login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("owner@gymos.com");
    await page.getByLabel("Password").fill("Owner@123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByRole("button", { name: /Marcus Reyes/ }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();

    await expect(page).toHaveURL(/\/login/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
