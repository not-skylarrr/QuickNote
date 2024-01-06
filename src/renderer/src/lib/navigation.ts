export const GetNoteEditorLocationString = (noteID: string) => {
    const params = new URLSearchParams({
        openedNotes: JSON.stringify([noteID]),
    });
    return `/editor?${params.toString()}`;
};
