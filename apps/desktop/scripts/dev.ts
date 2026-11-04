import { execFileSync, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { createServer } from "vite-plus";

const desktopRoot = resolve(import.meta.dirname, "..");
const electronBinary: string = createRequire(import.meta.url)("electron");

const renderer = await createServer({
  root: resolve(desktopRoot, "../web"),
  server: { port: 0 },
});
await renderer.listen();
const rendererUrl = renderer.resolvedUrls?.local[0];
if (!rendererUrl) throw new Error("Renderer dev server has no local URL");
renderer.printUrls();

const app = spawn(electronBinary, [desktopRoot], {
  stdio: "inherit",
  env: {
    ...process.env,
    DESKTOP_RENDERER_URL: rendererUrl,
    DESKTOP_USER_DATA_DIR: resolve(desktopRoot, ".user-data"),
    DESKTOP_TITLE_SUFFIX: execFileSync("git", ["branch", "--show-current"], {
      encoding: "utf8",
    }).trim(),
  },
});

app.on("exit", async (code) => {
  await renderer.close();
  process.exit(code ?? 0);
});
process.on("SIGINT", () => app.kill());
process.on("SIGTERM", () => app.kill());
