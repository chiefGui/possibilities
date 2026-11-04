import { NodeServices } from "@effect/platform-node";
import { Api } from "@possibilities/contract";
import * as Core from "@possibilities/core";
import { Effect, Fiber, Layer } from "effect";
import { RpcServer } from "effect/rpc";
import { app, BrowserWindow } from "electron";
import { join } from "node:path";

import { ipcProtocol } from "./ipc.ts";

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

const server = Effect.runFork(
  Layer.launch(
    RpcServer.layer(Api).pipe(
      Layer.provide([Core.layer(app.getPath("userData")), ipcProtocol]),
      Layer.provide(NodeServices.layer),
    ),
  ),
);

void app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => void Effect.runPromise(Fiber.interrupt(server)));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
