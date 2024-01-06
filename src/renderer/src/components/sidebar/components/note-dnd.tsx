import { useDraggable } from "@dnd-kit/core";
import { NoteManifest } from "src/preload/shared_types";

const NoteDragWrapper = ({
    children,
    note,
}: {
    children: React.ReactNode;
    note: NoteManifest;
}) => {
    const { setNodeRef, attributes, listeners, transform } = useDraggable({
        id: `note-${note.id}`,
        data: {
            type: "note-link",
        },
    });

    const DraggableStyle = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={DraggableStyle}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
};

export default NoteDragWrapper;
