import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktop", {
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
  setColorScheme: (scheme: string) => ipcRenderer.send("color-scheme", scheme),
});
