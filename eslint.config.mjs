import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * Feature-isolation boundaries (see docs/GymOS-Architecture-v1.md §3).
 *
 * Element types map to folders. Rules below encode the allowed dependency
 * graph so a violation fails lint, not code review:
 *  - `feature` may not import another `feature`'s internals — only its `index.ts` barrel.
 *  - `ui` (design system) may never import `feature`, `store`, or `app`.
 *  - only `repository` elements may import `mocks` or the http client.
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
            { from: "ui", allow: ["ui", "hooks", "lib", "types"] },
            { from: "shared", allow: ["ui", "hooks", "lib", "types", "shared"] },
            { from: "layout", allow: ["ui", "shared", "hooks", "feature", "feature-types", "config", "store", "lib", "types"] },
            { from: "feature", allow: ["ui", "shared", "hooks", "lib", "types", "constants", "config", "store", "feature", "feature-types"] },
            { from: "hooks", allow: ["lib", "store", "config", "types"] },
            { from: "repository", allow: ["lib", "types", "mocks", "repository", "feature-types"] },
            { from: "mocks", allow: ["types", "lib", "feature-types"] },
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
