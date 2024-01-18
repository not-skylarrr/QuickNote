import { createId } from "@paralleldrive/cuid2";
import { NoteManifest, PlaintextNote } from "../../preload/shared_types";
import { CreateIpcEndpoint } from "../lib/ipc";
import {
    DeleteFileFromStorageSpace,
    GetAllFilesFromStorageSpace,
    WriteFileToStorageSpace,
} from "../lib/storage";
import { DEFAULT_EDITOR_STATE, NoteSchema } from "../lib/notes/consts";

export const NotesEndpointV2 = CreateIpcEndpoint("notes", {
    get: async (): Promise<NoteSchema[]> => {
        const noteFiles = GetAllFilesFromStorageSpace("notes");
        if (!noteFiles.success) return [];

        const parsedNoteFiles = noteFiles.data
            .map((f) => {
                const parsedFile = NoteSchema.safeParse(JSON.parse(f.content));
                if (!parsedFile.success) return null;
                return parsedFile.data;
            })
            .filter((f) => f != null) as NoteSchema[];

        return parsedNoteFiles;
    },

    create: async (
        title: string,
        options?: Omit<Partial<PlaintextNote>, "id" | "createdAt">,
    ) => {
        const note: NoteSchema = {
            type: "plaintext",
            id: createId(),
            title: title,
            icon: null,
            content: DEFAULT_EDITOR_STATE,
            createdAt: new Date(),
            updatedAt: new Date(),
            parentFolder: null,
            pinned: false,
            tags: [],
            ...options,
        };

        WriteFileToStorageSpace(
            "notes",
            `${note.id}.qnote`,
            JSON.stringify(note, null, 4),
        );

        return note;
    },

    update: async (noteID: string, newNote: NoteManifest): Promise<boolean> => {
        const parsedNote = NoteSchema.safeParse(newNote);
        if (!parsedNote.success) return false;

        const result = WriteFileToStorageSpace(
            "notes",
            `${noteID}.qnote`,
            JSON.stringify(parsedNote.data, null, 4),
        );

        return result.success;
    },

    delete: async (noteID: string) => {
        return DeleteFileFromStorageSpace("notes", `${noteID}.qnote`);
    },
});
