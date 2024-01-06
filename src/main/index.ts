import { BrowserWindow } from "electron";
import AppInstance from "./classes/instance";
import { CreateIpcEndpointV2, RegisterEndpoint } from "./lib/ipc/v2";
import { ConfigEndpointV2 } from "./services/config";
import { NotesEndpointV2 } from "./services/notes";

const instance = new AppInstance({
    window: {
        height: 900,
        width: 1200,
        frame: false,
        webPreferences: {
            spellcheck: false,
        },
    },
});

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
        instance.app.quit();
    },
});

RegisterEndpoint(NotesEndpointV2);
RegisterEndpoint(ConfigEndpointV2);
RegisterEndpoint(WindowEndpoint);
