import { channel } from "contract/channel";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktop", {
  invoke: (name: string, input: unknown) => ipcRenderer.invoke(channel, name, input),
});
