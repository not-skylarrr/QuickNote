import Icon from "@renderer/components/ui/icon";
import { cn } from "@renderer/lib/utils";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";
import { useSidebarTabs } from ".";
import SidebarFooter from "../footer";
import { SplitNoteItem } from "../split-note-item";

const FolderTabWrapper = ({ children }: { children: React.ReactNode }) => {
    const { tabID, setTabID } = useSidebarTabs();
    const { notes } = useNotes();
    const { openedNoteIds } = useEditorNavigation();

    return (
        <div className="flex h-screen w-[300px] shrink-0 flex-col overflow-hidden bg-muted">
            <div className="mb-2 flex h-12 flex-row items-center justify-between px-2">
                <div className="flex flex-row">
                    <button
                        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:text-muted-foreground/50"
                        disabled={tabID == null}
                        onClick={() => setTabID(null)}
                    >
                        <Icon icon={LuChevronLeft} dimensions={20} />
                    </button>
                    <button
                        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:bg-inherit disabled:text-muted-foreground/50"
                        disabled
                    >
                        <Icon icon={LuChevronRight} dimensions={20} />
                    </button>
                </div>

                <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <Icon icon={LuSearch} dimensions={16} />
                </button>
            </div>
            {openedNoteIds.length == 2 && (
                <div className="mb-6 flex flex-col gap-1 px-2">
                    <span className="mb-1 pl-[2px] text-xs font-medium text-muted-foreground opacity-100 transition-opacity duration-200 group-data-[collapsed=true]/sidebar:opacity-0">
                        Split View
                    </span>
                    {openedNoteIds.length == 2 && (
                        <div className="flex flex-row gap-1">
                            {openedNoteIds.map((noteID) => {
                                const note = notes.find((n) => n.id == noteID);
                                if (!note) return null;

                                return (
                                    <SplitNoteItem key={note.id} note={note} />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <div className="relative h-full w-full">{children}</div>

            <SidebarFooter />
        </div>
    );
};

type FolderTabProps = {
    defaultTab?: boolean;
    tabID: string;
    children: React.ReactNode;
};

const FolderTab = ({ children, defaultTab = false, tabID }: FolderTabProps) => {
    const { tabID: activeTabID } = useSidebarTabs();

    const [PassedInitialLoad, SetPassedInitialLoad] = useState(false);
    const [Hidden, SetHidden] = useState(defaultTab);

    const TabActive =
        activeTabID == tabID || (defaultTab && activeTabID == null);

    useEffect(() => {
        if (Hidden) {
            setTimeout(() => {
                SetPassedInitialLoad(true);
            }, 300);
        }
    }, [PassedInitialLoad, Hidden]);

    useEffect(() => {
        if (TabActive && Hidden) {
            SetHidden(false);
            return;
        }

        if (!TabActive && !Hidden) {
            SetHidden(true);
        }
    }, [TabActive, Hidden]);

    return (
        <div
            className={cn(
                "absolute z-10 flex h-full w-full translate-x-0 flex-col gap-6 bg-muted",
                Hidden && !defaultTab && "translate-x-[300px]",
                Hidden && defaultTab && "-translate-x-[300px]",
                TabActive && !defaultTab && "z-20",
                PassedInitialLoad && "transition-transform duration-300",
            )}
        >
            {children}
        </div>
    );
};

export { FolderTab, FolderTabWrapper };
