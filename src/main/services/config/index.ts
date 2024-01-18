import { BrowserWindow, nativeTheme } from "electron";
import {
    GetApplicationConfig,
    GetUserApplicationConfig,
    UpdateUserApplicationConfig,
} from "../../lib/config";
import {
    ApplicationConfig,
    ApplicationConfigLabels,
    UserApplicationConfig,
} from "../../lib/config/consts";
import { CreateIpcEndpoint } from "../../lib/ipc";

export const ConfigEndpointV2 = CreateIpcEndpoint("config", {
    get: async () => {
        const userConfig = GetUserApplicationConfig();
        return GetApplicationConfig(userConfig);
    },
    getLabels: async () => {
        return ApplicationConfigLabels;
    },
    update: async (updates: UserApplicationConfig) => {
        if (updates["application.theme"]) {
            let uiThemeType: ApplicationConfig["application.theme"] =
                updates["application.theme"];

            if (uiThemeType != "dark" && uiThemeType != "light") {
                uiThemeType = "light";
            }

            nativeTheme.themeSource = uiThemeType;
            BrowserWindow.getFocusedWindow()?.webContents.send(
                "theme:update",
                updates["application.theme"],
            );
        }
        return UpdateUserApplicationConfig(updates);
    },
});
