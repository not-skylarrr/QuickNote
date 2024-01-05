import { GetFileFromStorageSpace, WriteFileToStorageSpace } from "../storage";
import { ObjectMerge } from "../utils";
import {
    ApplicationConfig,
    ApplicationConfigSchema,
    BaseApplicationConfig,
    UserApplicationConfig,
} from "./const";

export const GetApplicationConfig = (userConfig: UserApplicationConfig) => {
    const mergedSettings = ObjectMerge<ApplicationConfig>(
        BaseApplicationConfig,
        userConfig,
    );

    return mergedSettings;
};

export const GetUserApplicationConfig = () => {
    const userConfig = GetFileFromStorageSpace("config", "settings.json");
    if (!userConfig.success) return {};

    const userConfigObject = ApplicationConfigSchema.safeParse(
        JSON.parse(userConfig.data),
    );
    if (!userConfigObject.success) return {};

    return userConfigObject.data;
};

export const UpdateUserApplicationConfig = (updates: UserApplicationConfig) => {
    const existingConfig = GetUserApplicationConfig();
    const mergedConfig = ObjectMerge(existingConfig, updates);

    WriteFileToStorageSpace(
        "config",
        "settings.json",
        JSON.stringify(mergedConfig, null, 4),
    );
};
