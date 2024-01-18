import { useConfirmation } from "@renderer/providers/dialogs/confirmation-dialog";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useConfig } from "@renderer/providers/ipc/config-provider";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useShortcut } from "@renderer/providers/shortcut-provider";
import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "sonner";
import { PlaintextNote } from "src/preload/shared_types";
import TextEditor from "./lexical";
import { DecircularizeObject } from "./utils";
import { GetTagsFromNoteContent } from "./lexical/lib/tags";

type PlaintextEditorProps = {
    note: PlaintextNote;
};

const PlaintextEditor = ({ note }: PlaintextEditorProps) => {
    const { config } = useConfig();
    const { updatePlaintextNote } = useNotes();
    const { focusedNote, setNoteFocused } = useEditorNavigation();
    const { openDialog } = useConfirmation();

    const NoteFocused = focusedNote == note.id;

    const [Content, SetContent] = useState(note.content);
    const [SavedContent, SetSavedContent] = useState(note.content);

    const blocker = useBlocker(
        JSON.stringify(Content) != JSON.stringify(SavedContent),
    );

    const HandleEditorStateChange = (state: Record<string, any>) => {
        SetContent(state);
    };

    const SaveNoteToDisk = async (autosave: boolean = false) => {
        if (!NoteFocused && !autosave) return;

        const updatedNoteTags = GetTagsFromNoteContent(
            DecircularizeObject(Content),
        );
        const updatedNote = await updatePlaintextNote(note.id, {
            content: DecircularizeObject(Content),
            tags: updatedNoteTags,
        });

        if (updatedNote == null) {
            return toast.error("Failed to save note");
        }

        SetSavedContent(Content);

        return toast.success(
            `${autosave ? "Autosaved" : "Saved"} "${note.title}" successfully`,
        );
    };

    useShortcut(
        "CTRL+S",
        () => {
            SaveNoteToDisk();
        },
        [Content, NoteFocused],
    );

    useEffect(() => {
        if (blocker.state == "blocked") {
            openDialog({
                title: "Unsaved Progress",
                description: `You are about to leave the editor and will lose all of your changes inside of "${note.title}".`,
                onConfim: {
                    destructive: true,
                    label: "Leave Editor",
                    action: () => {
                        blocker.proceed();
                    },
                },
            });
        }
    }, [blocker]);

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

    return (
        <TextEditor
            initialState={note.content}
            onChange={HandleEditorStateChange}
            onFocus={() => setNoteFocused(note.id)}
        />
    );
};

export default PlaintextEditor;
