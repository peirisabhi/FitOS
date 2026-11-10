import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Toaster } from "@/components/ui/sonner";

/**
 * Integration test: renders the real LoginForm against the real
 * `useLogin` hook, which hits the real MSW handler
 * (mocks/handlers/auth.handlers.ts) — the same one the app uses in dev.
 * `<Toaster />` is mounted alongside it since sonner only renders a toast
 * into the DOM if something is subscribed to render it. Only
 * `next/navigation` is mocked (see src/test/setup.ts), so we can assert
 * on the post-login redirect.
 */
function renderLoginForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
      <Toaster />
    </QueryClientProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("logs in with valid credentials and redirects to the dashboard", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText("Email"), "owner@gymos.com");
    await user.type(screen.getByLabelText("Password"), "Owner@123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows an error and does not redirect on invalid credentials", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText("Email"), "owner@gymos.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(screen.getByText("Invalid email or password.")).toBeInTheDocument());
    expect(push).not.toHaveBeenCalled();
  });

  it("rejects an empty submission with client-side validation before hitting the network", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });
});
