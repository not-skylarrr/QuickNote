import { BrowserWindow, app } from "electron";
import { CreateIpcEndpointV2 } from "../lib/ipc/v2";

export const WindowEndpoint = CreateIpcEndpointV2("window", {
    minimize: () => {
        BrowserWindow.getFocusedWindow()?.minimize();
    },
    maximize: () => {
        const window = BrowserWindow.getFocusedWindow();
        if (!window) return;

        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    },
    close: () => {
        app.quit();
    },
});
