import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useShortcut } from "@renderer/providers/shortcut-provider";
import { useSidebarTabs } from "../sidebar/components/tabs";
import { useNavigate } from "react-router-dom";
import { GetNoteNavigationString } from "@renderer/lib/navigation";

const ApplicationShortcuts = () => {
    const { createNote } = useNotes();
    const { tabID } = useSidebarTabs();
    const navigate = useNavigate();

    useShortcut("CTRL+N", async () => {
        const note = await createNote("New Note", { parentFolder: tabID });
        navigate(GetNoteNavigationString(note.id));
    });

    return null;
};

export default ApplicationShortcuts;
