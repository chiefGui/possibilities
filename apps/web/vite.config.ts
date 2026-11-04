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
  server: { port: 5173, strictPort: true },
  plugins: lazyPlugins(() => [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    stylex({ aliases: { "@/*": [`${src}/*`] } }),
    react(),
  ]),
});
