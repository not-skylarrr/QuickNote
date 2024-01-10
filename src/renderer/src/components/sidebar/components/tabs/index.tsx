import { createContext, useContext, useState } from "react";

type SidebarTabContext = {
    tabID: string | null;
    setTabID: (id: string | null) => void;
};

const SidebarTabContext = createContext<SidebarTabContext | undefined>(
    undefined,
);

const SidebarTabProvider = ({ children }: { children: React.ReactNode }) => {
    const [TabID, SetTabID] = useState<string | null>(null);

    return (
        <SidebarTabContext.Provider
            value={{ tabID: TabID, setTabID: SetTabID }}
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
