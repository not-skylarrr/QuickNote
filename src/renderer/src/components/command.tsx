import { useShortcut } from "@renderer/providers/shortcut-provider";
import { useState } from "react";
import { LuFile, LuFilePlus, LuFolderPlus } from "react-icons/lu";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { Dialog, DialogContent } from "./ui/dialog";
import Icon from "./ui/icon";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { Emoji } from "./ui/emoji/elem";
import { GetNoteNavigationString } from "@renderer/lib/navigation";
import { NoteManifest } from "src/preload/shared_types";
import { useNavigate } from "react-router-dom";
import { useFolders } from "@renderer/providers/ipc/folder-provider";
import { useSidebarTabs } from "./sidebar/components/tabs";

const ApplicationSearch = () => {
    const { notes, createNote } = useNotes();
    const { folders, createFolder } = useFolders();
    const { tabID } = useSidebarTabs();
    const navigate = useNavigate();

    const [Open, SetOpen] = useState(false);

    const HandleNoteCreation = async () => {
        const note = await createNote("New Note", { parentFolder: tabID });
        navigate(GetNoteNavigationString(note.id));
        SetOpen(false);
    };

    const HandleFolderCreation = async () => {
        await createFolder("New Folder", {
            parentFolder: tabID,
        });
        SetOpen(false);
    };

    const HandleNoteNavigation = (note: NoteManifest) => {
        const noteEditorString = GetNoteNavigationString(note.id, true);
        navigate(noteEditorString);
        SetOpen(false);
    };

    useShortcut("CTRL+K", () => {
        SetOpen((curr) => !curr);
    });

    return (
        <Dialog open={Open} onOpenChange={SetOpen}>
            <DialogContent className="w-full max-w-[600px] p-0">
                <Command>
                    <CommandInput
                        className="text-base"
                        placeholder="Search Application"
                    />
                    <CommandList>
                        <CommandGroup heading="Quick Actions">
                            <CommandItem
                                value="New Note"
                                onSelect={() => HandleNoteCreation()}
                            >
                                <Icon
                                    icon={LuFilePlus}
                                    className="mr-2"
                                    dimensions={16}
                                />{" "}
                                New Note
                            </CommandItem>
                            <CommandItem
                                value="New Folder"
                                onSelect={() => HandleFolderCreation()}
                            >
                                <Icon
                                    icon={LuFolderPlus}
                                    className="mr-2"
                                    dimensions={16}
                                />
                                New Folder
                            </CommandItem>
                        </CommandGroup>
                        {folders.map((folder) => {
                            const folderNotes = notes.filter(
                                (n) => n.parentFolder == folder.id,
                            );
                            return (
                                <CommandGroup heading={folder.title}>
                                    {folderNotes.map((note) => {
                                        return (
                                            <CommandItem
                                                onSelect={() =>
                                                    HandleNoteNavigation(note)
                                                }
                                                value={`${folder.title} ${
                                                    note.title
                                                } ${note.tags.join(" ")}`}
                                            >
                                                {note.icon ? (
                                                    <Emoji
                                                        code={note.icon}
                                                        dimensions={16}
                                                        className="mr-2"
                                                    />
                                                ) : (
                                                    <Icon
                                                        icon={LuFile}
                                                        className="mr-2"
                                                        dimensions={16}
                                                    />
                                                )}
                                                {note.title}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            );
                        })}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationSearch;
