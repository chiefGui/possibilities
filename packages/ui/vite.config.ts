import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      typecheck: { command: "tsrs --fast", dependsOn: ["build"] },
    },
  },
});
