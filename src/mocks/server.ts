import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";

/** Used by Vitest/RTL for component/integration tests — not shipped to the browser. */
export const server = setupServer(...handlers);
