import { defineConfig } from "vite-plus";

const generated = ["**/routeTree.gen.ts"];

export default defineConfig({
  fmt: { ignorePatterns: generated },
  lint: {
    ignorePatterns: generated,
    plugins: ["react", "typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "react/rules-of-hooks": "error",
      "react/only-export-components": ["warn", { allowConstantExport: true }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@hugeicons/*", "@hugeicons-pro/*"],
              message: "Register the glyph in @/ui/icon and render <Icon name />.",
            },
          ],
        },
      ],
    },
    overrides: [
      {
        files: ["apps/web/src/routes/**"],
        rules: { "react/only-export-components": "off" },
      },
      {
        files: ["apps/web/src/ui/icon.tsx"],
        rules: { "no-restricted-imports": "off" },
      },
    ],
    options: { typeAware: true, typeCheck: false },
  },
  run: {
    cache: true,
  },
  staged: {
    "*": "vp check --fix",
  },
});
