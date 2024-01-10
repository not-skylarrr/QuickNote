import { BrowserWindow, nativeTheme } from "electron";
import {
    GetApplicationConfig,
    GetUserApplicationConfig,
    UpdateUserApplicationConfig,
} from "../../lib/config";
import {
    ApplicationConfigLabels,
    UserApplicationConfig,
} from "../../lib/config/consts";
import { CreateIpcEndpointV2 } from "../../lib/ipc/v2";

export const ConfigEndpointV2 = CreateIpcEndpointV2("config", {
    get: async () => {
        const userConfig = GetUserApplicationConfig();
        return GetApplicationConfig(userConfig);
    },
    getLabels: async () => {
        return ApplicationConfigLabels;
    },
    update: async (updates: UserApplicationConfig) => {
        if (updates["application.theme"]) {
            nativeTheme.themeSource = updates["application.theme"];
            BrowserWindow.getFocusedWindow()?.webContents.send(
                "theme:update",
                updates["application.theme"],
            );
        }
        return UpdateUserApplicationConfig(updates);
    },
});
