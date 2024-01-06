import { contextBridge, ipcRenderer } from "electron";

const api = {
    ipc: {
        ...ipcRenderer,
        on: (channel: string, listener: (...args) => any) => {
            ipcRenderer.on(channel, listener);
        },
    },
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
    window.api = api;
}
