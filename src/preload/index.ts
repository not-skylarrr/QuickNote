import { contextBridge, ipcRenderer } from "electron";
import { UseIpcEndpoint } from "../main/lib/ipc";
import { WindowEndpoint } from "../main/services/window";
import { NotesEndpoint } from "../main/services/notes";
import { ConfigEndpoint } from "../main/services/config";

const api = {
    ipc: {
        on: (channel: string, listener: (...args) => any) => {
            ipcRenderer.on(channel, listener);
        },
    },
    config: UseIpcEndpoint(ConfigEndpoint),
    notes: UseIpcEndpoint(NotesEndpoint),
    window: UseIpcEndpoint(WindowEndpoint),
};
export type ApiInterface = typeof api;

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
