import { app, BrowserWindow, nativeTheme } from "electron";
import { join } from "node:path";

const { DESKTOP_RENDERER_URL, DESKTOP_USER_DATA_DIR, DESKTOP_TITLE_SUFFIX } = process.env;

if (DESKTOP_USER_DATA_DIR) app.setPath("userData", DESKTOP_USER_DATA_DIR);

const canvas = { light: "#fdfdfd", dark: "#0a0a0a" };

function canvasColor() {
  return nativeTheme.shouldUseDarkColors ? canvas.dark : canvas.light;
}

nativeTheme.on("updated", () => {
  for (const win of BrowserWindow.getAllWindows()) win.setBackgroundColor(canvasColor());
});

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    show: false,
    backgroundColor: canvasColor(),
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

void app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
