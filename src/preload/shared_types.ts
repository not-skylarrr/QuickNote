export type PlaintextNote = {
    type: "plaintext";
    id: string;
    title: string;
    icon: string | null;
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    parentFolder: string | null;
    pinned: boolean;
};

export type EncryptedNote = {
    type: "encrypted";
    id: string;
    title: string;
    icon: string | null;
    content: string;
    encryptionKeyHash: string;
    createdAt: Date;
    updatedAt: Date;
    parentFolder: string | null;
    pinned: boolean;
};

export type NoteManifest = PlaintextNote | EncryptedNote;

export type {
    ApplicationConfig,
    ApplicationConfigLabels,
} from "../main/lib/config/const";
