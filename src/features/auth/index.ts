/**
 * Public surface of the `auth` feature. Other features/pages import ONLY
 * from here — never reach into `features/auth/hooks/useLogin` etc. directly
 * (enforced by eslint-plugin-boundaries, see eslint.config.mjs).
 */
export * from "@/features/auth/components";
export * from "@/features/auth/hooks";
export * from "@/features/auth/schemas";
export * from "@/features/auth/types";
