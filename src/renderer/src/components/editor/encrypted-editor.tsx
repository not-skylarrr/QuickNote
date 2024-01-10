import { InvokeIpc } from "@renderer/lib/ipc";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useEncryptionDialog } from "@renderer/providers/dialogs/encryption-dialog";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EncryptedNote, PlaintextNote } from "src/preload/shared_types";
import TextEditor from "./lexical";
import { DecircularizeObject } from "./utils";

type EncryptedEditorProps = {
    note: EncryptedNote;
};

const EncryptedEditor = ({ note }: EncryptedEditorProps) => {
    const navigate = useNavigate();
    const { updateEncryptedNote } = useNotes();
    const { focusedNote, setNoteFocused } = useEditorNavigation();
    const { requestNoteUnlock } = useEncryptionDialog();

    const NoteFocused = focusedNote == note.id;

    const [PlaintextNote, SetPlaintextNote] = useState<PlaintextNote | null>(
        null,
    );
    const [DecryptionKey, SetDecryptionKey] = useState<string | null>(null);
    const [Content, SetContent] = useState<Record<string, any> | null>(null);

    const HandleEditorStateChange = (state: Record<string, any>) => {
        SetContent(state);
    };

    const SaveNoteToDisk = async () => {
        if (!NoteFocused || !PlaintextNote || !Content || !DecryptionKey)
            return;

        // Combine the decrypted plaintext note with the new content from the editor
        const updatedPlaintextNote: PlaintextNote = {
            ...PlaintextNote,
            content: DecircularizeObject(Content),
        };

        // Encrypt the entire plaintext file
        // Could maybe create and ipc endpoint to update an encrypted file without this step
        // Potential problems: KeySalt and Initialization vector mismatches
        const response = await InvokeIpc(
            "encryption",
            "encryptNote",
            updatedPlaintextNote,
            DecryptionKey,
        );
        if (!response.success) return toast.error("Failed to save note");

        // Update the current encrypted file on disk with the new encrypted content and new hash
        const updatedNote = updateEncryptedNote(note.id, {
            content: response.data.content,
            encryptionKeyHash: response.data.encryptionKeyHash,
        });

        if (!updatedNote) return toast.error("Failed to save note");

        return toast.success("Saved Note Successfully");
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
    }, [Content, NoteFocused, DecryptionKey, PlaintextNote]);

    useEffect(() => {
        requestNoteUnlock(note, (response) => {
            if (!response.success) {
                return navigate(-1);
            }

            SetPlaintextNote(response.data);
            SetContent(response.data.content);
            SetDecryptionKey(response.key);
        });
    }, []);

    return (
        <div className="h-full w-full">
            {Content && (
                <TextEditor
                    initialState={Content}
                    onChange={HandleEditorStateChange}
                    onFocus={() => setNoteFocused(note.id)}
                />
            )}
        </div>
    );
};

export default EncryptedEditor;
