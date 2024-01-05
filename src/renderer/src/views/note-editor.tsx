import { AppWindowContent } from "@renderer/components/core/window";
import PlaintextEditor from "@renderer/components/editor/plaintext-editor";
import { useNotes } from "@renderer/providers/notes-provider";
import { useParams } from "react-router-dom";

export default function NoteEditorView() {
    const { noteID } = useParams();
    const { notes } = useNotes();

    if (!noteID) return <span>Failed to load note</span>;

    const note = notes.find((n) => n.id == noteID);
    if (!note) return <span>Note not found</span>;

    window.localStorage.setItem("recent-note", note.id);

    if (note.type == "plaintext")
        return (
            <AppWindowContent>
                <PlaintextEditor key={note.id} note={note} />
            </AppWindowContent>
        );

    return <span>Unsupported note type</span>;
}
