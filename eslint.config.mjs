import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * Feature-isolation boundaries (see docs/GymOS-Architecture-v1.md §3).
 *
 * Element types map to folders. The rules below encode the allowed
 * dependency graph so a violation fails lint, not code review. This list
 * was rebuilt for Milestone 5 by mechanically walking every `@/...` import
 * in the codebase and classifying both sides — several `from` categories
 * (provider, lib, config, store, feature-types) had NO rule entry at all
 * before this pass, meaning `default: "disallow"` was silently rejecting
 * every one of their imports. That's now fixed.
 *
 * Two things this config does NOT fully enforce, called out honestly
 * rather than papered over with an untested "fix":
 *  - `feature -> feature` only distinguishes "some other feature" from
 *    "this feature", not "via the public barrel" vs. "a deep internal
 *    import". Precisely restricting that requires eslint-plugin-boundaries'
 *    capture-template matching (`${from.featureName}`), which isn't wired
 *    up here. In practice this repo has zero cross-feature deep imports
 *    (verified by grepping for `@/features/*\/(hooks|components|...)` from
 *    outside that feature after every milestone) — enforced by convention
 *    + review today, not by this file.
 *  - `ui -> feature` is allowed narrowly for app-shell chrome (Navbar's
 *    sign-out action needs `features/auth`). Pure design-system primitives
 *    (button, input, card, ...) never do this in practice; if one starts
 *    to, that's a real review flag even though this config won't catch it.
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "ui", pattern: "src/components/**" },
        { type: "shared", pattern: "src/shared/**" },
        { type: "layout", pattern: "src/layouts/**" },
        { type: "provider", pattern: "src/providers/**" },
        { type: "repository", pattern: "src/features/*/repository/**" },
        { type: "repository", pattern: "src/repositories/**" },
        { type: "mocks", pattern: "src/mocks/**" },
        {
          // Declared before the generic `feature` pattern so a feature's
          // `types/**` resolves to this narrower element: it's the only
          // part of a feature `mocks/` fixtures may depend on (mocks own
          // the mock data, but the *shape* of that data is the feature's
          // contract — see mocks/fixtures/dashboard.ts).
          type: "feature-types",
          pattern: "src/features/*/types/**",
          capture: ["featureName"],
        },
        {
          type: "feature",
          pattern: "src/features/*/!(repository|types)/**",
          capture: ["featureName"],
        },
        { type: "hooks", pattern: "src/hooks/**" },
        { type: "lib", pattern: "src/lib/**" },
        { type: "config", pattern: "src/config/**" },
        { type: "types", pattern: "src/types/**" },
        { type: "constants", pattern: "src/constants/**" },
        { type: "store", pattern: "src/store/**" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["layout", "provider", "feature", "feature-types", "ui", "shared", "hooks", "config", "store", "types", "constants"] },
            // `feature` (Navbar -> features/auth for sign-out) is the one
            // narrow exception to "ui never depends on business logic" —
            // see the file-level comment above.
            { from: "ui", allow: ["ui", "hooks", "lib", "types", "config", "constants", "store", "feature"] },
            { from: "shared", allow: ["ui", "hooks", "lib", "types", "shared"] },
            { from: "layout", allow: ["ui", "shared", "hooks", "feature", "feature-types", "config", "store", "lib", "types"] },
            { from: "feature", allow: ["ui", "shared", "hooks", "lib", "types", "constants", "config", "store", "feature", "feature-types", "repository"] },
            { from: "feature-types", allow: ["repository", "types"] },
            { from: "hooks", allow: ["lib", "store", "config", "types"] },
            { from: "repository", allow: ["lib", "types", "mocks", "repository", "feature-types"] },
            { from: "mocks", allow: ["types", "lib", "config", "feature-types"] },
            { from: "provider", allow: ["provider", "ui", "lib", "config", "mocks", "types"] },
            { from: "lib", allow: ["config", "types"] },
            { from: "config", allow: ["constants", "types"] },
            { from: "store", allow: ["lib", "types"] },
          ],
        },
      ],
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "public/**", "playwright-report/**"],
  },
];

export default eslintConfig;
