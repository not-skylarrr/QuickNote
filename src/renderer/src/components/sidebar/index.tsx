import { useNotes } from "@renderer/providers/notes-provider";
import { useEffect, useState } from "react";
import SidebarFooter from "./components/footer";
import SidebarNoteItem from "./components/note-sidebar-item";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { SplitNoteItem } from "./components/split-note-item";

export default function AppSidebar() {
    const { notes } = useNotes();
    const { openedNoteIds } = useEditorNavigation();

    const [Hidden, SetHidden] = useState(false);

    const HandleDocumentKeyDown = (ev: KeyboardEvent) => {
        if (ev.shiftKey && ev.ctrlKey && ev.key == "S") {
            SetHidden((curr) => !curr);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", HandleDocumentKeyDown);

        return () => {
            document.removeEventListener("keydown", HandleDocumentKeyDown);
        };
    }, []);

    return (
        <div
            className="group/sidebar flex h-full w-[300px] shrink-0 flex-col gap-6 overflow-hidden bg-muted pt-10 transition-[width] duration-300 ease-in-out data-[collapsed=true]:w-[54px] [&>*]:shrink-0"
            data-collapsed={Hidden}
        >
            {openedNoteIds.length == 2 && (
                <div className="flex flex-col gap-1 px-2">
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

            <div className="flex flex-col gap-1 px-2">
                <span className="mb-1 pl-[2px] text-xs font-medium text-muted-foreground opacity-100 transition-opacity duration-200 group-data-[collapsed=true]/sidebar:opacity-0">
                    Notes
                </span>
                {notes.map((n) => {
                    if (
                        openedNoteIds.length == 2 &&
                        openedNoteIds.includes(n.id)
                    )
                        return null;
                    return <SidebarNoteItem key={n.id} note={n} />;
                })}
            </div>

            <SidebarFooter />
        </div>
    );
}
