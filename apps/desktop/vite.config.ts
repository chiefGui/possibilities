import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/main.ts", "src/preload.ts"],
    format: "cjs",
    platform: "node",
    target: "node24",
    deps: { neverBundle: ["electron"] },
    dts: false,
  },
  run: {
    tasks: {
      dev: {
        command: ["vp pack", "WEB_DEV_SERVER_URL=http://localhost:5173 electron ."],
        cache: false,
      },
    },
  },
});
