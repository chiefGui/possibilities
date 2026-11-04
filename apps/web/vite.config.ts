import stylex from "@stylexjs/unplugin/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, lazyPlugins } from "vite-plus";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  base: "./",
  resolve: {
    alias: { "@": src },
  },
  plugins: lazyPlugins(() => [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: `${src}/routes`,
      generatedRouteTree: `${src}/routeTree.gen.ts`,
    }),
    stylex({ aliases: { "@/*": [`${src}/*`] } }),
    react(),
  ]),
});
