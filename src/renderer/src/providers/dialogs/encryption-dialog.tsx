import {
    LockNoteDialog,
    UnlockNoteDialog,
} from "@renderer/components/encryption/lock-note-dialog";
import { InvokeIpc } from "@renderer/lib/ipc";
import { createContext, useContext, useState } from "react";
import {
    EncryptedNote,
    NoteManifest,
    PlaintextNote,
} from "src/preload/shared_types";
import { useConfig } from "../ipc/config-provider";

type EncryptionResponse<T = any> =
    | { success: true; data: T; key: string }
    | { success: false; error: string };

type EncryptionResponseWithoutKey<T = any> =
    | { success: true; data: T }
    | { success: false; error: string };

type LockRequestCallback = (
    response: EncryptionResponse<EncryptedNote>,
) => void;
type UnlockRequestCallback = (
    response: EncryptionResponse<PlaintextNote>,
) => void;

type EncryptionDialogContext = {
    requestNoteLock: (
        note: PlaintextNote,
        callback: LockRequestCallback,
    ) => void;
    requestNoteUnlock: (
        note: EncryptedNote,
        callback: UnlockRequestCallback,
    ) => void;
};

const EncryptionDialogContext = createContext<
    EncryptionDialogContext | undefined
>(undefined);

type CachedEncryptionKeys = Record<
    string,
    {
        key: string;
        validUntil: Date;
    }
>;

const EncryptionDialogProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { config } = useConfig();

    const [CachedKeys, SetCachedKeys] = useState<CachedEncryptionKeys>({});

    const [Note, SetNote] = useState<NoteManifest | null>(null);
    const [UnlockCallback, SetUnlockCallback] =
        useState<UnlockRequestCallback | null>(null);
    const [LockCallback, SetLockCallback] =
        useState<LockRequestCallback | null>(null);

    const UnlockNoteFromCache = (
        note: EncryptedNote,
    ): Promise<EncryptionResponseWithoutKey> => {
        return new Promise<EncryptionResponseWithoutKey<PlaintextNote>>(
            async (res) => {
                const response = await InvokeIpc(
                    "encryption",
                    "decryptNote",
                    note,
                    CachedKeys[note.id].key,
                );
                res(response);
            },
        );
    };

    const RequestNoteUnlock = (
        note: EncryptedNote,
        callback: (response: EncryptionResponse<PlaintextNote>) => void,
    ) => {
        if (
            config["encryption.cacheNotePasswords"] == true &&
            CachedKeys[note.id] &&
            CachedKeys[note.id].validUntil.getTime() > Date.now()
        ) {
            UnlockNoteFromCache(note).then((response) => {
                if (response.success) {
                    callback({ ...response, key: CachedKeys[note.id].key });
                } else {
                    SetNote(note);
                    SetUnlockCallback(() => callback);
                }
            });
            return;
        }

        SetNote(note);
        SetUnlockCallback(() => callback);
    };

    const RequestNoteLock = (
        note: PlaintextNote,
        callback: (response: EncryptionResponse<EncryptedNote>) => void,
    ) => {
        SetNote(note);
        SetLockCallback(() => callback);
    };

    const HandleUnlockCallback = (
        response: EncryptionResponse<PlaintextNote>,
    ) => {
        if (!UnlockCallback) {
            console.error("No Callback...");

            SetNote(null);
            SetUnlockCallback(null);
            return;
        }

        if (response.success && config["encryption.cacheNotePasswords"]) {
            SetCachedKeys((curr) => {
                curr[response.data.id] = {
                    key: response.key,
                    validUntil: new Date(
                        Date.now() +
                            config["encryption.passwordCacheSeconds"] * 1000,
                    ),
                };
                return curr;
            });
        }

        UnlockCallback(response);

        SetNote(null);
        SetLockCallback(null);
    };

    const HandleLockCallback = (
        response: EncryptionResponse<EncryptedNote>,
    ) => {
        if (!LockCallback) {
            console.error("No Callback...");

            SetNote(null);
            SetLockCallback(null);
            return;
        }

        LockCallback(response);

        SetNote(null);
        SetLockCallback(null);
    };

    return (
        <EncryptionDialogContext.Provider
            value={{
                requestNoteLock: RequestNoteLock,
                requestNoteUnlock: RequestNoteUnlock,
            }}
        >
            {children}

            {Note?.type == "encrypted" && (
                <UnlockNoteDialog note={Note} onUnlock={HandleUnlockCallback} />
            )}

            {Note?.type == "plaintext" && (
                <LockNoteDialog note={Note} onLock={HandleLockCallback} />
            )}
        </EncryptionDialogContext.Provider>
    );
};

const useEncryptionDialog = () => {
    const ctx = useContext(EncryptionDialogContext);
    if (!ctx) throw new Error("I cba ");
    return ctx;
};

export default EncryptionDialogProvider;
export { useEncryptionDialog };
