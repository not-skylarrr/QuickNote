import { Over, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

export const useDragStatus = () => {
    const [DragInProgress, SetDragInProgress] = useState(false);
    const [Dropzone, SetDropzone] = useState<Over | null>(null);

    useDndMonitor({
        onDragStart: () => {
            SetDragInProgress(true);
        },
        onDragEnd: () => {
            SetDragInProgress(false);
        },
        onDragOver: (ev) => {
            SetDropzone(ev.over);
        },
        onDragCancel: () => {
            SetDropzone(null);
        },
    });

    return {
        dropzone: Dropzone,
        dragInProgress: DragInProgress,
    };
};
