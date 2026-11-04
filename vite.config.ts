import { defineConfig } from "vite-plus";

const generated = ["**/routeTree.gen.ts"];

export default defineConfig({
  fmt: { ignorePatterns: generated },
  lint: {
    ignorePatterns: generated,
    plugins: ["react", "typescript", "oxc"],
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "possibilities", specifier: "./lint/possibilities.js" },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "possibilities/no-pointer-cursor": "error",
      "react/rules-of-hooks": "error",
      "react/only-export-components": ["warn", { allowConstantExport: true }],
    },
    overrides: [
      {
        files: ["apps/web/src/routes/**"],
        rules: { "react/only-export-components": "off" },
      },
    ],
    options: { typeAware: true, typeCheck: false },
  },
  run: {
    cache: true,
  },
});
