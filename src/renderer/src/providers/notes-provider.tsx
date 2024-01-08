import { InvokeIpc } from "@renderer/lib/ipc";
import { createContext, useContext, useEffect, useState } from "react";
import {
    EncryptedNote,
    NoteManifest,
    PlaintextNote,
} from "src/preload/shared_types";

type DataProviderContext = {
    notes: NoteManifest[];
    createNote: (title: string) => Promise<NoteManifest>;
    updatePlaintextNote: (
        noteID: string,
        updates: Partial<PlaintextNote>,
    ) => Promise<PlaintextNote | null>;
    updateEncryptedNote: (
        noteID: string,
        updates: Partial<EncryptedNote>,
    ) => Promise<EncryptedNote | null>;
    deleteNote: (noteID: string) => Promise<void>;
};

const DataProviderContext = createContext<DataProviderContext | undefined>(
    undefined,
);

const NotesDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [Notes, SetNoteState] = useState<NoteManifest[]>([]);

    const SetNotes = (notes: NoteManifest[]) => {
        notes.sort((a, b) => {
            if (a.pinned && !b.pinned) {
                return -1;
            } else if (!a.pinned && b.pinned) {
                return 1;
            } else {
                return a.title < b.title ? -1 : 1;
            }
        });
        SetNoteState(notes);
    };

    const CreateNote = async (title: string) => {
        const note = await InvokeIpc("notes", "create", title);
        const noteArray = [...Notes, note];
        SetNotes(noteArray);
        return note;
    };

    const UpdatePlaintextNote = async (
        noteID: string,
        updates: Partial<PlaintextNote>,
    ) => {
        const noteIndex = Notes.findIndex((n) => n.id == noteID);
        if (noteIndex == -1) return null;

        const note = Object.assign({}, Notes[noteIndex]);
        if (note.type != "plaintext" || updates.type == "plaintext")
            return null;

        const updatedNote = { ...note, ...updates };
        const success = await InvokeIpc("notes", "update", noteID, updatedNote);

        if (success) {
            const clonedNoteArray = [...Notes];
            clonedNoteArray.splice(noteIndex, 1, updatedNote);
            SetNotes(clonedNoteArray);
            return updatedNote;
        }

        return null;
    };

    const UpdateEncryptedNote = async (
        noteID: string,
        updates: Partial<EncryptedNote>,
    ) => {
        const noteIndex = Notes.findIndex((n) => n.id == noteID);
        if (noteIndex == -1) return null;

        const note = Object.assign({}, Notes[noteIndex]) as NoteManifest;
        if (note.type != "encrypted" && updates.type != "encrypted")
            return null;

        const updatedNote = { ...note, ...updates } as EncryptedNote;
        const success = await InvokeIpc("notes", "update", noteID, updatedNote);

        if (success) {
            const clonedNoteArray = [...Notes];
            clonedNoteArray.splice(noteIndex, 1, updatedNote);
            SetNotes(clonedNoteArray);
            return updatedNote;
        }

        return null;
    };

    const DeleteNote = async (noteID: string) => {
        const noteIndex = Notes.findIndex((n) => n.id == noteID);
        if (noteIndex == -1) return;

        const clonedNotesArray = [...Notes];
        clonedNotesArray.splice(noteIndex, 1);

        await InvokeIpc("notes", "delete", noteID);

        SetNotes(clonedNotesArray);
    };

    const FetchInitialData = async () => {
        const notes = await InvokeIpc("notes", "get");
        SetNotes(notes);
    };

    useEffect(() => {
        FetchInitialData();
    }, []);

    return (
        <DataProviderContext.Provider
            value={{
                notes: Notes,
                createNote: CreateNote,
                updatePlaintextNote: UpdatePlaintextNote,
                updateEncryptedNote: UpdateEncryptedNote,
                deleteNote: DeleteNote,
            }}
        >
            {children}
        </DataProviderContext.Provider>
    );
};

const useNotes = () => {
    const ctx = useContext(DataProviderContext);
    if (!ctx)
        throw new Error(
            "No ApplicationDataProvider found when calling useApplicationData",
        );

    return ctx;
};

export default NotesDataProvider;
export { useNotes };
