import { optimizer, is } from "@electron-toolkit/utils";
import {
    App,
    BrowserWindow,
    BrowserWindowConstructorOptions,
    app,
    nativeTheme,
} from "electron";
import { join } from "path";
import { ObjectMerge } from "../lib/utils";

type AppInstanceOptions = {
    window: BrowserWindowConstructorOptions;
};

class AppInstance {
    app: App = app;
    window?: BrowserWindow;

    constructor(options: AppInstanceOptions) {
        app.whenReady().then(() => {
            this.createAppListeners();
            this.createWindow(options.window);
        });

        nativeTheme.themeSource = "dark";
    }

    private createAppListeners() {
        app.on("browser-window-created", (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });

        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        });
    }

    private createWindow({
        webPreferences,
        ...options
    }: BrowserWindowConstructorOptions) {
        this.window = new BrowserWindow({
            show: false,
            webPreferences: ObjectMerge(
                {
                    preload: join(__dirname, "../preload/index.js"),
                    sandbox: false,
                },
                webPreferences || {},
            ),
            ...options,
        });

        this.window.on("ready-to-show", () => {
            this.window?.show();
        });

        this.window.webContents.setWindowOpenHandler(() => {
            return { action: "deny" };
        });

        if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            this.window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
        } else {
            this.window.loadFile(join(__dirname, "../renderer/index.html"));
        }
    }
}

export default AppInstance;
