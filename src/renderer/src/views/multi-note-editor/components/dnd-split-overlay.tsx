import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useDragStatus } from "@renderer/hooks/dnd";
import { cn } from "@renderer/lib/utils";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";

const EditorSplitDndLayer = () => {
    const { dragInProgress } = useDragStatus();

    if (!dragInProgress) return null;

    return (
        <div className="absolute left-0 right-0 top-0 z-40 grid h-full w-full grid-cols-2">
            <SplitEditorDropZone side="left" />
            <SplitEditorDropZone side="right" />
        </div>
    );
};

type SplitEditorDropzoneProps = {
    side: "left" | "right";
};

const SplitEditorDropZone = ({ side }: SplitEditorDropzoneProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `editor-split-${side}`,
    });
    const { splitNoteLeft, splitNoteRight } = useEditorNavigation();

    const HandleDragEnd = (ev: DragEndEvent) => {
        if (!isOver) return;

        const noteID = ev.active.id.toString().replace("note-", "");
        if (!noteID) return;

        if (side == "left") splitNoteLeft(noteID);
        if (side == "right") splitNoteRight(noteID);
    };

    useDndMonitor({
        onDragEnd: HandleDragEnd,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex h-full w-full items-center justify-center",
                isOver &&
                    "border-2 border-foreground/50 bg-accent/50 transition-all duration-100",
            )}
        />
    );
};

export default EditorSplitDndLayer;
