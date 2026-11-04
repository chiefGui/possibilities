import { NodeServices } from "@effect/platform-node";
import { Effect, Layer, ManagedRuntime } from "effect";
import { app, BrowserWindow } from "electron";
import { join } from "node:path";

import { environment, repositories } from "./github.ts";
import { Registry } from "./registry.ts";
import { serve } from "./rpc.ts";
import { createWorkspace, listWorkspaces, openWorkspace } from "./workspaces.ts";

const { DESKTOP_RENDERER_URL, DESKTOP_USER_DATA_DIR, DESKTOP_TITLE_SUFFIX } = process.env;

if (DESKTOP_USER_DATA_DIR) app.setPath("userData", DESKTOP_USER_DATA_DIR);

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      contextIsolation: true,
      sandbox: true,
    },
  });

  win.once("ready-to-show", () => win.show());

  if (DESKTOP_TITLE_SUFFIX) {
    win.on("page-title-updated", (event, title) => {
      event.preventDefault();
      win.setTitle(`${title} — ${DESKTOP_TITLE_SUFFIX}`);
    });
  }

  if (DESKTOP_RENDERER_URL) {
    void win.loadURL(DESKTOP_RENDERER_URL);
  } else {
    void win.loadFile(join(__dirname, "../../web/dist/index.html"));
  }
}

const runtime = ManagedRuntime.make(
  Registry.layer(app.getPath("userData")).pipe(Layer.provideMerge(NodeServices.layer)),
);

serve(runtime, {
  environment: () => environment,
  repositories: () => repositories,
  workspaces: () => listWorkspaces,
  openWorkspace,
  createWorkspace,
});

void app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => void Effect.runPromise(runtime.disposeEffect));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
