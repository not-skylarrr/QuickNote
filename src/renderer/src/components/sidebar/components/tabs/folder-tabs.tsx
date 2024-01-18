import Icon from "@renderer/components/ui/icon";
import { cn } from "@renderer/lib/utils";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { InvokeShortcut } from "@renderer/providers/shortcut-provider";
import { useEffect, useState } from "react";
import {
    LuChevronLeft,
    LuChevronRight,
    LuLayout,
    LuSearch,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { useSidebarTabs } from ".";
import SidebarFooter from "../footer";
import { SplitNoteItem } from "../split-note-item";

const FolderTabWrapper = ({ children }: { children: React.ReactNode }) => {
    const { history, back } = useSidebarTabs();
    const { notes } = useNotes();
    const { openedNoteIds } = useEditorNavigation();

    const OpenApplicationSearch = () => {
        InvokeShortcut("CTRL+K");
    };

    return (
        <div className="flex h-screen w-[300px] shrink-0 flex-col overflow-hidden bg-muted">
            <div className="mb-2 flex h-12 flex-row items-center justify-between px-2">
                <div className="flex flex-row">
                    <button
                        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:text-muted-foreground/50 disabled:hover:bg-transparent"
                        disabled={history.length <= 1}
                        onClick={() => back()}
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

                <div className="flex flex-row">
                    <button
                        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        onClick={OpenApplicationSearch}
                    >
                        <Icon icon={LuSearch} dimensions={16} />
                    </button>
                    <Link
                        to="/"
                        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        <Icon icon={LuLayout} dimensions={16} />
                    </Link>
                </div>
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
    tabID: string;
    children: React.ReactNode;
};

const FolderTab = ({ children, tabID }: FolderTabProps) => {
    const { tabID: activeTabID, history } = useSidebarTabs();
    const assignedTabID = tabID == "root" ? null : tabID;

    const [PassedInitialLoad, SetPassedInitialLoad] = useState(false);
    const [Hidden, SetHidden] = useState(activeTabID == assignedTabID);

    const TabActive = activeTabID == assignedTabID;

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
                Hidden &&
                    !history.includes(assignedTabID) &&
                    "translate-x-[300px]",
                Hidden &&
                    history.includes(assignedTabID) &&
                    "-translate-x-[300px]",
                TabActive && "z-20",
                PassedInitialLoad && "transition-transform duration-300",
            )}
        >
            {children}
        </div>
    );
};

export { FolderTab, FolderTabWrapper };
