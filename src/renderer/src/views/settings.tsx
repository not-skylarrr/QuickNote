import { AppWindowContent } from "@renderer/components/core/window";
import {
    SettingsNumberInput,
    SettingsSelectInput,
} from "@renderer/components/settings/inputs";
import { Input } from "@renderer/components/ui/input";
import { Separator } from "@renderer/components/ui/separator";
import { ObjectKeys } from "@renderer/lib/utils";
import { useConfig } from "@renderer/providers/config-provider";
import { useState } from "react";
import { ApplicationConfig } from "src/preload/shared_types";

export default function SettingsView() {
    const { config, configLabels, updateConfig } = useConfig();

    const [Query, SetQuery] = useState("");

    const GetSettingGroups = () => {
        const groups: string[] = [];

        for (let setting of Object.keys(config)) {
            const [group] = setting.split(".", 1);
            if (!groups.includes(group)) {
                groups.push(group);
            }
        }

        return groups;
    };

    const HandleSettingValueChange = async (setting: string, value: any) => {
        updateConfig({ [setting]: value });
    };

    return (
        <AppWindowContent className="flex flex-col gap-8">
            <div className="flex flex-row items-center justify-between">
                <span className="text-3xl font-semibold">
                    Application Settings
                </span>
                <Input
                    value={Query}
                    onChange={(ev) => SetQuery(ev.target.value)}
                    className="w-[300px]"
                    placeholder="Search Settings"
                />
            </div>

            {GetSettingGroups().map((configGroup) => {
                return (
                    <div className="flex flex-col gap-2">
                        <h5 className="text-2xl font-medium capitalize">
                            {configGroup}
                        </h5>

                        <Separator />

                        <div className="mt-2 flex flex-col gap-4">
                            {ObjectKeys(config).map((setting) => {
                                const settingLabelData = configLabels[setting];

                                if (!setting.startsWith(`${configGroup}.`))
                                    return null;

                                const queryMatchesKey = setting
                                    .toLowerCase()
                                    .includes(Query.toLowerCase());
                                const queryMatchesLabel = settingLabelData.title
                                    .toLowerCase()
                                    .includes(Query.toLowerCase());

                                if (!queryMatchesKey && !queryMatchesLabel)
                                    return null;

                                return (
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex max-w-[500px] flex-col">
                                            <span className="font-normal">
                                                {settingLabelData.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {settingLabelData.description}
                                            </span>
                                        </div>

                                        {settingLabelData.inputType ==
                                            "select" &&
                                            settingLabelData.inputOptions && (
                                                <SettingsSelectInput
                                                    value={config[setting]}
                                                    options={
                                                        settingLabelData.inputOptions
                                                    }
                                                    onChange={(value) =>
                                                        HandleSettingValueChange(
                                                            setting,
                                                            value,
                                                        )
                                                    }
                                                />
                                            )}

                                        {settingLabelData.inputType ==
                                            "number" && (
                                            <SettingsNumberInput
                                                value={config[setting]}
                                                onChange={(value) =>
                                                    HandleSettingValueChange(
                                                        setting,
                                                        value,
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            {}
                        </div>
                    </div>
                );
            })}
        </AppWindowContent>
    );
}
