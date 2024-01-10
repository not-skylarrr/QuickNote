import {
    ResizableHandle,
    ResizablePanelGroup,
} from "@renderer/components/ui/resizable";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useEffect, useState } from "react";
import { NoteManifest } from "src/preload/shared_types";
import EditorSplitDndLayer from "./components/dnd-split-overlay";
import EditorNoteSplitPanel from "./components/note-split-panel";

export default function MultiNoteEditor() {
    const { notes } = useNotes();
    const { openedNoteIds, focusedNote } = useEditorNavigation();

    const [OpenedNotes, SetOpenedNotes] = useState<NoteManifest[]>([]);

    const PrimaryNote = OpenedNotes[0];
    const SecondaryNote = OpenedNotes[1];

    useEffect(() => {
        const openedNotes = openedNoteIds
            .map((noteID) => notes.find((n) => n.id == noteID))
            .filter((n) => n != undefined) as NoteManifest[];

        SetOpenedNotes(openedNotes);
    }, [openedNoteIds]);

    useEffect(() => {
        if (!focusedNote) return;
        window.localStorage.setItem("recent-note", focusedNote);
    }, [focusedNote]);

    if (!PrimaryNote) return null;

    return (
        <div className="relative z-10 h-full w-full">
            <ResizablePanelGroup direction="horizontal">
                <EditorNoteSplitPanel key={PrimaryNote.id} note={PrimaryNote} />

                {SecondaryNote && (
                    <>
                        <ResizableHandle />
                        <EditorNoteSplitPanel
                            key={SecondaryNote.id}
                            note={SecondaryNote}
                        />
                    </>
                )}
            </ResizablePanelGroup>

            <EditorSplitDndLayer />
        </div>
    );
}
