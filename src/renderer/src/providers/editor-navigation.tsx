import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type EditorNavigationContext = {
    focusedNote: string | null;
    setFocusedNote: (noteID: string | null) => void;
    openedNoteIds: string[];
    setOpenedNoteIds: (noteIds: string[]) => void;
};

const EditorNavigationContext = createContext<
    EditorNavigationContext | undefined
>(undefined);

const EditorNavigationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [FocusedNote, SetFocusedNote] = useState<string | null>(null);
    const [OpenedNoteIds, SetOpenedNoteIds] = useState<string[]>([]);

    return (
        <EditorNavigationContext.Provider
            value={{
                focusedNote: FocusedNote,
                setFocusedNote: SetFocusedNote,
                openedNoteIds: OpenedNoteIds,
                setOpenedNoteIds: SetOpenedNoteIds,
            }}
        >
            {children}
        </EditorNavigationContext.Provider>
    );
};

const useEditorNavigation = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const context = useContext(EditorNavigationContext);

    if (!context)
        throw new Error(
            "No EditorNavigationProvider found when calling useEditorNavigation",
        );

    const { focusedNote, openedNoteIds, setFocusedNote, setOpenedNoteIds } =
        context;

    const ParseSearchParamString = (): string[] => {
        try {
            const openedNoteIds = searchParams.get("openedNotes");
            if (!openedNoteIds) return [];

            const openedNotesIdsJson = JSON.parse(openedNoteIds);
            if (!Array.isArray(openedNotesIdsJson)) return [];

            return openedNotesIdsJson;
        } catch (e) {
            return [];
        }
    };

    const IsNoteOpen = (noteID: string) => {
        return openedNoteIds.includes(noteID);
    };

    const CloseNote = (noteID: string) => {
        if (openedNoteIds.length <= 1) return;

        setSearchParams({
            openedNotes: JSON.stringify(
                openedNoteIds.filter((n) => n != noteID),
            ),
        });
    };

    const SplitNoteRight = (noteID: string) => {
        if (openedNoteIds.includes(noteID)) return;
        setFocusedNote(noteID);

        setSearchParams({
            openedNotes: JSON.stringify([openedNoteIds.at(0), noteID]),
        });
    };

    const SplitNoteLeft = (noteID: string) => {
        if (openedNoteIds.includes(noteID)) return;
        setFocusedNote(noteID);

        setSearchParams({
            openedNotes: JSON.stringify([noteID, openedNoteIds.at(-1)]),
        });
    };

    useEffect(() => {
        const openedNotes = ParseSearchParamString();
        setOpenedNoteIds(openedNotes);
    }, [searchParams]);

    return {
        closeNote: CloseNote,
        focusedNote: focusedNote,
        isNoteOpen: IsNoteOpen,
        openedNoteIds: openedNoteIds,
        setNoteFocused: setFocusedNote,
        splitNoteRight: SplitNoteRight,
        splitNoteLeft: SplitNoteLeft,
    };
};

export default EditorNavigationProvider;
export { useEditorNavigation };
