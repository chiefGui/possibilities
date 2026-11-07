import { defineConfig } from "vite-plus";

const bundle = (entry: string) => ({
  entry: [entry],
  format: "cjs" as const,
  target: "node24",
  deps: { neverBundle: ["electron"], alwaysBundle: (id: string) => id !== "electron" },
});

export default defineConfig({
  pack: [bundle("src/main.ts"), { ...bundle("src/preload.ts"), clean: false }],
  run: {
    tasks: {
      dev: {
        command: "bun scripts/dev.ts",
        dependsOn: ["build", "@possibilities/ui#build"],
        cache: false,
      },
      start: {
        command: "electron .",
        dependsOn: ["build", "@possibilities/web#build"],
        cache: false,
      },
      package: {
        command: "electron-builder",
        dependsOn: ["build", "@possibilities/web#build"],
        cache: false,
      },
    },
  },
});
