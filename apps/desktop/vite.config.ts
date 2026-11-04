import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/main.ts", "src/preload.ts"],
    format: "cjs",
    target: "node24",
    deps: { neverBundle: ["electron"] },
  },
  run: {
    tasks: {
      dev: {
        command: "bun scripts/dev.ts",
        dependsOn: ["build"],
        cache: false,
      },
      start: {
        command: "electron .",
        dependsOn: ["build", "web#build"],
        cache: false,
      },
      package: {
        command: "electron-builder",
        dependsOn: ["build", "web#build"],
        cache: false,
      },
    },
  },
});
