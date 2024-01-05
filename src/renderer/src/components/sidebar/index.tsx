import { useNotes } from "@renderer/providers/notes-provider";
import { useEffect, useState } from "react";
import SidebarFooter from "./components/footer";
import SidebarNoteItem from "./components/note-sidebar-item";

export default function AppSidebar() {
    const { notes } = useNotes();

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
            className="group/sidebar flex h-full w-[300px] shrink-0 flex-col gap-1 overflow-hidden bg-muted pt-10 transition-[width] duration-300 ease-in-out data-[collapsed=true]:w-[54px] [&>*]:shrink-0"
            data-collapsed={Hidden}
        >
            <div className="flex flex-col gap-1 px-2">
                <span className="mb-1 pl-[2px] text-xs text-muted-foreground opacity-100 transition-opacity duration-200 group-data-[collapsed=true]/sidebar:opacity-0">
                    Notes
                </span>
                {notes.map((n) => {
                    return <SidebarNoteItem key={n.id} note={n} />;
                })}
            </div>

            <SidebarFooter />
        </div>
    );
}
