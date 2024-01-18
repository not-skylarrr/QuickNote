import { BrowserWindow, app } from "electron";
import { CreateIpcEndpoint } from "../lib/ipc";

export const WindowEndpoint = CreateIpcEndpoint("window", {
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
