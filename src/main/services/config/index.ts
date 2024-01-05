import { nativeTheme } from "electron";
import {
    GetApplicationConfig,
    GetUserApplicationConfig,
    UpdateUserApplicationConfig,
} from "../../lib/config";
import {
    ApplicationConfigLabels,
    UserApplicationConfig,
} from "../../lib/config/const";
import { CreateIpcEndpoint } from "../../lib/ipc";
import AppInstance from "../../classes/instance";

export const ConfigEndpoint = CreateIpcEndpoint<{ instance: AppInstance }>()(
    "config",
    {
        get: async () => {
            const userConfig = GetUserApplicationConfig();
            return GetApplicationConfig(userConfig);
        },
        getLabels: async () => {
            return ApplicationConfigLabels;
        },
        update: async (ctx, updates: UserApplicationConfig) => {
            if (updates["application.theme"]) {
                nativeTheme.themeSource = updates["application.theme"];
                ctx.instance.window?.webContents.send(
                    "theme:update",
                    updates["application.theme"],
                );
            }
            return UpdateUserApplicationConfig(updates);
        },
    },
);
