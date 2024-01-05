import AppInstance from "../classes/instance";
import { CreateIpcEndpoint } from "../lib/ipc";

export const WindowEndpoint = CreateIpcEndpoint<{ instance: AppInstance }>()(
    "window",
    {
        minimize: (context) => {
            context.instance.window?.minimize();
        },
        maximize: (context) => {
            const window = context.instance.window;
            if (!window) return;

            if (window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
        },
        close: (context) => {
            context.instance.app.quit();
        },
    },
);
