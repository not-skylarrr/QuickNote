import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

export const useDragStatus = () => {
    const [DragInProgress, SetDragInProgress] = useState(false);

    useDndMonitor({
        onDragStart: () => {
            SetDragInProgress(true);
        },
        onDragEnd: () => {
            SetDragInProgress(false);
        },
    });

    return {
        dragInProgress: DragInProgress,
    };
};
