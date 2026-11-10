import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "@/mocks/server";

/**
 * Global test setup (Milestone 5). Every unit/component test in the app
 * runs through this file (see vitest.config.ts `setupFiles`).
 */

// MSW: the same handlers that back the real app (mocks/handlers) back
// component/integration tests too — one source of truth for what the
// "backend" returns, in dev and in tests.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

afterEach(() => cleanup());

// jsdom doesn't implement matchMedia — next-themes and useMediaQuery both need it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom doesn't implement ResizeObserver — several Radix primitives (Select, Tooltip) use it.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

// Default next/navigation mocks — most component tests don't care about
// routing, so this keeps them from crashing on missing App Router context.
// Tests that DO care (e.g. asserting a redirect) override with
// `vi.mocked(useRouter).mockReturnValue(...)` locally.
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));
