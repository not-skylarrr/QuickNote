import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlaintextNote } from "src/preload/shared_types";
import TextEditor from "./lexical";
import { DecircularizeObject } from "./utils";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useConfig } from "@renderer/providers/ipc/config-provider";

type PlaintextEditorProps = {
    note: PlaintextNote;
};

const PlaintextEditor = ({ note }: PlaintextEditorProps) => {
    const { config } = useConfig();
    const { updatePlaintextNote } = useNotes();
    const { focusedNote, setNoteFocused } = useEditorNavigation();

    const NoteFocused = focusedNote == note.id;

    const [Content, SetContent] = useState(note.content);

    const HandleEditorStateChange = (state: Record<string, any>) => {
        SetContent(state);
    };

    const SaveNoteToDisk = async (autosave: boolean = false) => {
        if (!NoteFocused && !autosave) return;

        const updatedNote = await updatePlaintextNote(note.id, {
            content: DecircularizeObject(Content),
        });

        if (updatedNote == null) {
            return toast.error("Failed to save note");
        }

        return toast.success(
            `${autosave ? "Autosaved" : "Saved"} "${note.title}" successfully`,
        );
    };

    const HandleDocumentKeyDown = (ev: KeyboardEvent) => {
        if (ev.ctrlKey && ev.key == "s") {
            ev.preventDefault();
            SaveNoteToDisk();
        }
    };

    useEffect(() => {
        if (!config["editor.autosave"]) return;
        if (JSON.stringify(note.content) == JSON.stringify(Content)) {
            console.log("Attempted saving current content");
            return;
        }

        const timeout = setTimeout(() => {
            SaveNoteToDisk(true);
        }, config["editor.autosaveDelay"]);

        return () => {
            clearTimeout(timeout);
        };
    }, [Content, config, note]);

    useEffect(() => {
        document.addEventListener("keydown", HandleDocumentKeyDown);

        return () => {
            document.removeEventListener("keydown", HandleDocumentKeyDown);
        };
    }, [Content, NoteFocused]);

    return (
        <TextEditor
            initialState={note.content}
            onChange={HandleEditorStateChange}
            onFocus={() => setNoteFocused(note.id)}
        />
    );
};

export default PlaintextEditor;
