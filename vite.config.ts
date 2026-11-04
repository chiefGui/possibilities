import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["**/routeTree.gen.ts"],
  },
  lint: {
    ignorePatterns: ["**/routeTree.gen.ts"],
    plugins: ["react", "typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "react/rules-of-hooks": "error",
      "react/only-export-components": ["warn", { allowConstantExport: true }],
    },
    overrides: [
      {
        files: ["apps/web/src/components/ui/**", "apps/web/src/routes/**"],
        rules: { "react/only-export-components": "off" },
      },
    ],
    options: { typeAware: true, typeCheck: false },
  },
  run: {
    cache: true,
  },
});
