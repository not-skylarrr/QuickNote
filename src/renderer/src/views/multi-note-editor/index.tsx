import PlaintextEditor from "@renderer/components/editor/plaintext-editor";
import {
    ResizableHandle,
    ResizablePanelGroup,
} from "@renderer/components/ui/resizable";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useNotes } from "@renderer/providers/notes-provider";
import { useEffect, useState } from "react";
import { NoteManifest } from "src/preload/shared_types";
import EditorNoteSplitPanel from "./components/note-split-panel";
import EditorSplitDndLayer from "./components/dnd-split-overlay";

export default function MultiNoteEditor() {
    const { notes } = useNotes();
    const { openedNoteIds, focusedNote } = useEditorNavigation();

    const [OpenedNotes, SetOpenedNotes] = useState<NoteManifest[]>([]);

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

    return (
        <div className="relative z-10 h-full w-full">
            {OpenedNotes.length == 1 && OpenedNotes[0].type == "plaintext" && (
                <div className="mb-4 flex flex-col px-8">
                    <div className="pointer-events-none mb-2 flex h-10 shrink-0 flex-row items-center">
                        <span className="text-sm text-muted-foreground">
                            {OpenedNotes[0].title}
                        </span>
                    </div>
                    <PlaintextEditor
                        key={OpenedNotes[0].id}
                        note={OpenedNotes[0]}
                    />
                </div>
            )}

            {OpenedNotes.length == 2 && (
                <ResizablePanelGroup direction="horizontal">
                    <EditorNoteSplitPanel
                        key={OpenedNotes[0].id}
                        note={OpenedNotes[0]}
                    />
                    <ResizableHandle />
                    <EditorNoteSplitPanel
                        key={OpenedNotes[1].id}
                        note={OpenedNotes[1]}
                    />
                </ResizablePanelGroup>
            )}

            <EditorSplitDndLayer />
        </div>
    );
}
