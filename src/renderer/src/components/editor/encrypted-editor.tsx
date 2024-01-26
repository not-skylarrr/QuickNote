import { InvokeIpc } from "@renderer/lib/ipc";
import { useEncryptionDialog } from "@renderer/providers/dialogs/encryption-dialog";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useConfig } from "@renderer/providers/ipc/config-provider";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useShortcut } from "@renderer/providers/shortcut-provider";
import { useEffect, useState } from "react";
import { LuLock, LuUnlock } from "react-icons/lu";
import { toast } from "sonner";
import { EncryptedNote, PlaintextNote } from "src/preload/shared_types";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import TextEditor from "./lexical";
import { DecircularizeObject } from "./utils";
import { useLocation } from "react-router-dom";
import { IsFromQuickNavOrigin } from "@renderer/lib/navigation";

type EncryptedEditorProps = {
    note: EncryptedNote;
};

const EncryptedEditor = ({ note }: EncryptedEditorProps) => {
    const { config } = useConfig();
    const { updateEncryptedNote } = useNotes();
    const { focusedNote, setNoteFocused } = useEditorNavigation();
    const { requestNoteUnlock } = useEncryptionDialog();
    const location = useLocation();

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

        return toast.success(`Saved "${note.title}" Successfully`);
    };

    const HandleNoteUnlock = () => {
        requestNoteUnlock(note, (response) => {
            if (!response.success) {
                return;
            }

            SetPlaintextNote(response.data);
            SetContent(response.data.content);
            SetDecryptionKey(response.key);
        });
    };

    useShortcut(
        "CTRL+S",
        () => {
            SaveNoteToDisk();
        },
        [Content, NoteFocused, DecryptionKey, PlaintextNote],
    );

    useEffect(() => {
        if (Content) return;

        if (
            config["encryption.promptUnlockOnQuickNavigation"] &&
            IsFromQuickNavOrigin(location)
        ) {
            HandleNoteUnlock();
            return;
        }

        if (config["encryption.promptUnlockOnNavigation"]) {
            HandleNoteUnlock();
        }
    }, [config, Content]);

    if (!Content)
        return (
            <div className="flex h-full w-full">
                <div className="m-auto flex w-full max-w-[300px] flex-col items-center justify-center gap-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Icon
                            className="stroke-muted-foreground"
                            icon={LuLock}
                            dimensions={64}
                        />
                        <h5 className="text-2xl font-semibold">Note Locked</h5>
                    </div>

                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={HandleNoteUnlock}
                    >
                        <Icon icon={LuUnlock} /> Unlock Note
                    </Button>
                </div>
            </div>
        );

    return (
        <TextEditor
            initialState={Content}
            onChange={HandleEditorStateChange}
            onFocus={() => setNoteFocused(note.id)}
        />
    );
};

export default EncryptedEditor;
