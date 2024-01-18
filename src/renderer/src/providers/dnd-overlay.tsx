import { DragOverlay, useDndMonitor } from "@dnd-kit/core";
import NoteDragPreview from "@renderer/components/sidebar/components/note/drag-preview";
import { useEffect, useState } from "react";
import { useNotes } from "./ipc/notes-provider";

export default function DndOverlayProvider() {
    const [ActiveType, SetActiveType] = useState<string | null>(null);
    const [ActiveID, SetActiveID] = useState<string | null>(null);

    useDndMonitor({
        onDragStart: (ev) => {
            const id = ev.active.id;
            if (typeof id != "string") return;

            console.log(ev.active.data.current?.type);

            SetActiveID(id);
            SetActiveType(ev.active.data.current?.type ?? null);
        },

        onDragEnd: () => {
            SetActiveID(null);
            SetActiveType(null);
        },
    });

    useEffect(() => {
        console.log(ActiveID, ActiveType);
    }, [ActiveID, ActiveType]);

    return (
        <DragOverlay dropAnimation={null} zIndex={50}>
            {ActiveType && ActiveID && (
                <>
                    {ActiveType == "note-link" && (
                        <NoteLinkOverlay id={ActiveID} />
                    )}
                </>
            )}
        </DragOverlay>
    );
}

const NoteLinkOverlay = ({ id }: { id: string }) => {
    const { notes } = useNotes();
    const note = notes.find((n) => n.id == id.replace("note-", ""));

    if (!note) return null;

    return <NoteDragPreview note={note} />;
};
