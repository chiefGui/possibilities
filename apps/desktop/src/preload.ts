import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("desktop", {
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
});
