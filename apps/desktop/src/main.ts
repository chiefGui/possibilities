import { app, BrowserWindow } from "electron";
import { join } from "node:path";

const webDevServerUrl = process.env.WEB_DEV_SERVER_URL;

function loadWebDevServerUntilReady(win: BrowserWindow, url: string) {
  win.webContents.on("did-fail-load", () => setTimeout(() => win.loadURL(url), 250));
  void win.loadURL(url);
}

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

  if (webDevServerUrl) {
    loadWebDevServerUntilReady(win, webDevServerUrl);
  } else {
    void win.loadFile(join(__dirname, "../../web/dist/index.html"));
  }
}

void app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
