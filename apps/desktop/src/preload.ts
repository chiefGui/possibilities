import { type Bridge, channel } from "@possibilities/contract/bridge";
import { contextBridge, type IpcRendererEvent, ipcRenderer } from "electron";

const bridge: Bridge = {
  send: (message) => ipcRenderer.send(channel, message),
  subscribe: (listener) => {
    const forward = (_event: IpcRendererEvent, message: unknown) => listener(message);
    ipcRenderer.on(channel, forward);
    return () => ipcRenderer.off(channel, forward);
  },
};

contextBridge.exposeInMainWorld("desktop", bridge);
