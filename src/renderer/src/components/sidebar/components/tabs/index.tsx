import { createContext, useContext, useState } from "react";

type SidebarTabContext = {
    tabID: string | null;
    history: (string | null)[];
    openTab: (id: string | null) => void;
    back: () => void;
};

const SidebarTabContext = createContext<SidebarTabContext | undefined>(
    undefined,
);

const SidebarTabProvider = ({ children }: { children: React.ReactNode }) => {
    const [TabID, SetTabID] = useState<string | null>(null);
    const [TabHistory, SetTabHistory] = useState<(string | null)[]>([null]);

    const ChangeTab = (tab: string | null) => {
        if (tab == null) {
            SetTabID(null);
            SetTabHistory([]);
            return;
        }
        SetTabID(tab);
        SetTabHistory((curr) => [...curr, tab]);
    };

    const GoBack = () => {
        SetTabID(TabHistory.at(-2) ?? null);
        SetTabHistory((curr) => curr.slice(0, -1));
    };

    return (
        <SidebarTabContext.Provider
            value={{
                tabID: TabID,
                history: TabHistory,
                openTab: ChangeTab,
                back: GoBack,
            }}
        >
            {children}
        </SidebarTabContext.Provider>
    );
};

const useSidebarTabs = () => {
    const ctx = useContext(SidebarTabContext);
    if (!ctx)
        throw new Error(
            "No SidebarTabProvider found when calling useSidebarTabs",
        );
    return ctx;
};

export { SidebarTabProvider, useSidebarTabs };
