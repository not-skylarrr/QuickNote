import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@renderer/components/ui/context-menu";
import { Emoji } from "@renderer/components/ui/emoji/elem";
import { EmojiSelector } from "@renderer/components/ui/emoji/selector";
import Icon from "@renderer/components/ui/icon";
import { cn } from "@renderer/lib/utils";
import { useFolders } from "@renderer/providers/ipc/folder-provider";
import { useState } from "react";
import {
    LuFolder,
    LuLink,
    LuSmilePlus,
    LuTextCursorInput,
    LuTrash,
} from "react-icons/lu";
import { FolderManifest } from "src/main/lib/folders/consts";
import { useSidebarTabs } from "../tabs";
import { useNotes } from "@renderer/providers/ipc/notes-provider";

type SidebarFolderItemProps = {
    folder: FolderManifest;
};

const SidebarFolderItem = ({ folder }: SidebarFolderItemProps) => {
    const { updateFolder, deleteFolder } = useFolders();
    const { notes, updateEncryptedNote, updatePlaintextNote } = useNotes();
    const { setTabID } = useSidebarTabs();

    const [Editable, SetEditable] = useState(false);

    const [FolderTitle, SetFolderTitle] = useState(folder.title);
    const [FolderIcon, SetFolderIcon] = useState(folder.icon);

    const { setNodeRef, isOver } = useDroppable({
        id: `folder-${folder.id}`,
        data: {
            type: "folder-drop",
        },
    });

    const HandleDragEnd = (ev: DragEndEvent) => {
        if (!isOver) return;

        const noteID = ev.active.id.toString().replace("note-", "");
        if (!noteID) return;

        const note = notes.find((n) => n.id == noteID);
        if (!note) return;

        if (note.type == "plaintext") {
            updatePlaintextNote(noteID, { parentFolder: folder.id });
        }

        if (note.type == "encrypted") {
            updateEncryptedNote(noteID, { parentFolder: folder.id });
        }
    };

    useDndMonitor({
        onDragEnd: HandleDragEnd,
    });

    const HandleFolderClick = () => {
        setTabID(folder.id);
    };

    const HandleInputKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key == "Escape") {
            ev.preventDefault();
            SetFolderTitle(folder.title);
            return;
        }

        if (ev.key == "Enter") {
            ev.preventDefault();

            if (FolderTitle.length == 0) {
                return SetFolderTitle(folder.title);
            }

            updateFolder(folder.id, { title: FolderTitle });
            SetEditable(false);
            return;
        }
    };

    const HandleIconChange = (icon: string | null) => {
        SetFolderIcon(icon);
        updateFolder(folder.id, { icon: icon });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {Editable ? (
                    <div
                        className="flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-sm font-normal transition-colors duration-100 hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0"
                        data-active={true}
                    >
                        {FolderIcon ? (
                            <Emoji code={FolderIcon} dimensions={18} />
                        ) : (
                            <Icon icon={LuFolder} dimensions={18} />
                        )}
                        <input
                            className="shrink-0 border-b border-b-primary bg-transparent p-0 text-foreground outline-none"
                            value={FolderTitle}
                            onChange={(ev) => SetFolderTitle(ev.target.value)}
                            onKeyDown={HandleInputKeyDown}
                            autoFocus
                        />
                    </div>
                ) : (
                    <button
                        ref={setNodeRef}
                        className={cn(
                            "group flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors duration-100",
                            "hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0",
                        )}
                        onClick={HandleFolderClick}
                        data-active={false || isOver}
                    >
                        {FolderIcon ? (
                            <Emoji code={FolderIcon} dimensions={18} />
                        ) : (
                            <Icon icon={LuFolder} dimensions={18} />
                        )}
                        <span className="border-b border-b-transparent">
                            {FolderTitle}
                        </span>
                    </button>
                )}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-[200px]">
                <ContextMenuItem>
                    <Icon icon={LuLink} /> Open Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onSelect={() => SetEditable(true)}>
                    <Icon icon={LuTextCursorInput} /> Rename Folder
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <Icon icon={LuSmilePlus} /> Change Icon
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="ml-2 p-0">
                        <EmojiSelector onSelect={HandleIconChange} />
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onSelect={() => deleteFolder(folder.id)}
                >
                    <Icon icon={LuTrash} />
                    Delete Folder
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default SidebarFolderItem;
