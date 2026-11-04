import { channel } from "@possibilities/contract/channel";
import { contextBridge, type IpcRendererEvent, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktop", {
  send: (message: unknown) => ipcRenderer.send(channel, message),
  subscribe: (listener: (message: unknown) => void) => {
    const forward = (_event: IpcRendererEvent, message: unknown) => listener(message);
    ipcRenderer.on(channel, forward);
    return () => ipcRenderer.off(channel, forward);
  },
});
