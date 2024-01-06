import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

export const DndProvider = ({ children }: { children: React.ReactNode }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    );

    return <DndContext sensors={sensors}>{children}</DndContext>;
};
