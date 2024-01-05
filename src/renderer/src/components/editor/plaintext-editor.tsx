import { useNotes } from "@renderer/providers/notes-provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlaintextNote } from "src/preload/shared_types";
import TextEditor from "./lexical";
import { DecircularizeObject } from "./utils";

type PlaintextEditorProps = {
    note: PlaintextNote;
};

const PlaintextEditor = ({ note }: PlaintextEditorProps) => {
    const { updatePlaintextNote } = useNotes();

    const [Content, SetContent] = useState(note.content);

    const HandleEditorStateChange = (state: Record<string, any>) => {
        SetContent(state);
    };

    const SaveNoteToDisk = async () => {
        const updatedNote = await updatePlaintextNote(note.id, {
            content: DecircularizeObject(Content),
        });

        if (updatedNote == null) {
            return toast.error("Failed to save note");
        }

        return toast.success("Note saved successfully");
    };

    const HandleDocumentKeyDown = (ev: KeyboardEvent) => {
        if (ev.ctrlKey && ev.key == "s") {
            ev.preventDefault();
            SaveNoteToDisk();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", HandleDocumentKeyDown);

        return () => {
            document.removeEventListener("keydown", HandleDocumentKeyDown);
        };
    }, [Content]);

    return (
        <TextEditor
            initialState={note.content}
            onChange={HandleEditorStateChange}
        />
    );
};

export default PlaintextEditor;
