import Icon from "@renderer/components/ui/icon";
import { ObjectMerge } from "@renderer/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import {
    ApplicationConfig,
    ApplicationConfigLabels,
} from "src/preload/shared_types";

type ConfigContext = {
    config: ApplicationConfig;
    configLabels: ApplicationConfigLabels;
    updateConfig: (changes: Partial<ApplicationConfig>) => void;
};

const ConfigContext = createContext<ConfigContext | undefined>(undefined);

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [Config, SetConfig] = useState<ApplicationConfig | null>(null);
    const [ConfigLabels, SetConfigLabels] =
        useState<ApplicationConfigLabels | null>(null);

    const UpdateConfig = async (changes: Partial<ApplicationConfig>) => {
        if (!Config) return;
        await window.api.config.update(changes);
        SetConfig({ ...ObjectMerge(Config, changes) });
        return;
    };

    const FetchConfig = async () => {
        const config = await window.api.config.get();
        const labels = await window.api.config.getLabels();
        SetConfig(config);
        SetConfigLabels(labels);
    };

    useEffect(() => {
        FetchConfig();
    }, []);

    if (!Config || !ConfigLabels)
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-background">
                <Icon
                    className="animate-spin"
                    icon={LuLoader2}
                    dimensions={40}
                />
                <span className="text-sm text-muted-foreground">
                    Loading Application
                </span>
            </div>
        );

    return (
        <ConfigContext.Provider
            value={{
                config: Config,
                configLabels: ConfigLabels,
                updateConfig: UpdateConfig,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};

const useConfig = () => {
    const ctx = useContext(ConfigContext);
    if (!ctx) throw new Error("No ConfigProvider found when calling useConfig");

    return ctx;
};

export default ConfigProvider;
export { useConfig };
