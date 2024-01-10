import { useDraggable } from "@dnd-kit/core";
import { ContextMenuSub } from "@radix-ui/react-context-menu";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@renderer/components/ui/context-menu";
import { Emoji } from "@renderer/components/ui/emoji/elem";
import { EmojiSelector } from "@renderer/components/ui/emoji/selector";
import Icon from "@renderer/components/ui/icon";
import { GetNoteEditorLocationString } from "@renderer/lib/navigation";
import { cn } from "@renderer/lib/utils";
import { useEncryptionDialog } from "@renderer/providers/dialogs/encryption-dialog";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useFolders } from "@renderer/providers/ipc/folder-provider";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { createRef, useState } from "react";
import {
    LuFile,
    LuFolder,
    LuHome,
    LuLink,
    LuLock,
    LuPin,
    LuPinOff,
    LuSmilePlus,
    LuSplitSquareHorizontal,
    LuTextCursorInput,
    LuTrash,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { NoteManifest, PlaintextNote } from "src/preload/shared_types";

type NoteSidebarItemProps = {
    note: NoteManifest;
};

const SidebarNoteItem = ({ note }: NoteSidebarItemProps) => {
    const inputRef = createRef<HTMLInputElement>();

    const { folders } = useFolders();
    const navigate = useNavigate();
    const { updatePlaintextNote, updateEncryptedNote, deleteNote } = useNotes();
    const {
        openedNoteIds,
        focusedNote,
        isNoteOpen,
        splitNoteLeft,
        splitNoteRight,
    } = useEditorNavigation();
    const { requestNoteLock } = useEncryptionDialog();

    const { setNodeRef, attributes, listeners, transform } = useDraggable({
        id: `note-${note.id}`,
        data: {
            type: "note-link",
        },
    });

    const DraggableStyle = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const [Editable, SetEditble] = useState(false);
    const [NoteTitle, SetNoteTitle] = useState(note.title);
    const [NoteIcon, SetNoteIcon] = useState(note.icon);

    const UpdateNoteData = (
        updates: Omit<Partial<PlaintextNote>, "type" | "content">,
    ) => {
        if (note.type == "plaintext") {
            updatePlaintextNote(note.id, updates);
        }

        if (note.type == "encrypted") {
            updateEncryptedNote(note.id, updates);
        }
    };

    const HandleTitleInputBlur = () => {
        if (NoteTitle != note.title) {
            if (NoteTitle.length == 0) {
                SetNoteTitle(note.title);
            } else {
                UpdateNoteData({ title: NoteTitle });
            }
        }

        SetEditble(false);
    };

    const HandleTitleInputKeyDown = (
        ev: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (ev.key == "Escape") {
            ev.preventDefault();
            SetNoteTitle(note.title);

            if (inputRef.current) {
                inputRef.current.blur();
            }
            return;
        }

        if (ev.key == "Enter") {
            ev.preventDefault();

            if (NoteTitle.length == 0) {
                return SetNoteTitle(note.title);
            }

            UpdateNoteData({ title: NoteTitle });
            SetEditble(false);
            return;
        }
    };

    const HandleNoteIconChange = (icon: string | null) => {
        SetNoteIcon(icon);
        UpdateNoteData({ icon: icon });
    };

    const HandleNoteLinkClick = () => {
        // If note is in single editor mode, replace displayed note
        if (openedNoteIds.length <= 1) {
            navigate(GetNoteEditorLocationString(note.id));
            return;
        }

        // Get the left and right note from the openedNoteArray
        const [leftNote, rightNote] = openedNoteIds;

        // If the focused note is left, replace the left side note with the new note
        if (focusedNote == leftNote) {
            splitNoteLeft(note.id);
            return;
        }

        // If the focused note is right, replace the right side note with the new note
        if (focusedNote == rightNote) {
            splitNoteRight(note.id);
            return;
        }
    };

    const HandleNoteLock = () => {
        if (note.type != "plaintext") return;

        requestNoteLock(note, (response) => {
            if (!response.success) return;

            updateEncryptedNote(note.id, {
                type: "encrypted",
                content: response.data.content,
                encryptionKeyHash: response.data.encryptionKeyHash,
            });
        });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {Editable ? (
                    // Div with input to allow user editing
                    <div
                        className="flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-sm font-normal transition-colors duration-100 hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0"
                        data-active={true}
                    >
                        {note.icon ? (
                            <Emoji code={note.icon} dimensions={18} />
                        ) : (
                            <Icon icon={LuFile} dimensions={18} />
                        )}
                        <input
                            ref={inputRef}
                            onBlur={HandleTitleInputBlur}
                            onKeyDown={HandleTitleInputKeyDown}
                            onChange={(ev) => SetNoteTitle(ev.target.value)}
                            value={NoteTitle}
                            className="shrink-0 border-b border-b-primary bg-transparent p-0 text-foreground outline-none"
                        />
                    </div>
                ) : (
                    // Button acting as link while editing is disabled
                    <button
                        className={cn(
                            "flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-sm font-normal transition-colors duration-100",
                            "hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0",
                        )}
                        ref={setNodeRef}
                        style={DraggableStyle}
                        {...listeners}
                        {...attributes}
                        data-active={isNoteOpen(note.id)}
                        data-note-id={note.id}
                        onClick={HandleNoteLinkClick}
                    >
                        {NoteIcon ? (
                            <Emoji code={NoteIcon} dimensions={18} />
                        ) : (
                            <Icon icon={LuFile} dimensions={18} />
                        )}
                        <span className="border-b border-b-transparent transition-all duration-300">
                            {NoteTitle}
                        </span>

                        <div className="ml-auto flex flex-row gap-2">
                            {note.type == "encrypted" && (
                                <Icon
                                    className={cn(
                                        "stroke-muted-foreground stroke-[3px]",
                                    )}
                                    icon={LuLock}
                                    dimensions={12}
                                />
                            )}

                            {note.pinned && (
                                <Icon
                                    className={cn(
                                        "fill-muted-foreground stroke-muted-foreground",
                                    )}
                                    icon={LuPin}
                                    dimensions={12}
                                />
                            )}
                        </div>
                    </button>
                )}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-[200px]">
                <ContextMenuItem>
                    <Icon icon={LuLink} /> Open Note
                </ContextMenuItem>

                <ContextMenuItem onSelect={() => splitNoteLeft(note.id)}>
                    <Icon icon={LuSplitSquareHorizontal} /> Split Left
                </ContextMenuItem>

                <ContextMenuItem onSelect={() => splitNoteRight(note.id)}>
                    <Icon icon={LuSplitSquareHorizontal} /> Split Right
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <Icon icon={LuFolder} />
                        Set Folder
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="ml-2 w-[200px]">
                        {note.parentFolder != null && (
                            <ContextMenuItem
                                onSelect={() =>
                                    UpdateNoteData({ parentFolder: null })
                                }
                            >
                                <Icon icon={LuHome} /> Home
                            </ContextMenuItem>
                        )}
                        {folders
                            .filter((f) => f.id != note.parentFolder)
                            .map((folder) => {
                                return (
                                    <ContextMenuItem
                                        onSelect={() =>
                                            UpdateNoteData({
                                                parentFolder: folder.id,
                                            })
                                        }
                                    >
                                        {folder.icon ? (
                                            <Emoji
                                                code={folder.icon}
                                                dimensions={16}
                                            />
                                        ) : (
                                            <Icon
                                                icon={LuFolder}
                                                dimensions={16}
                                            />
                                        )}
                                        {folder.title}
                                    </ContextMenuItem>
                                );
                            })}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSeparator />

                {/* Note customization options */}

                <ContextMenuItem onSelect={() => SetEditble(true)}>
                    <Icon icon={LuTextCursorInput} /> Rename Note
                </ContextMenuItem>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <Icon icon={LuSmilePlus} /> Change Icon
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="ml-2 p-0">
                        <EmojiSelector
                            columns={5}
                            emojiSize={20}
                            height={280}
                            onSelect={HandleNoteIconChange}
                        />
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSeparator />

                <ContextMenuItem
                    onSelect={() => UpdateNoteData({ pinned: !note.pinned })}
                >
                    {note.pinned ? (
                        <>
                            <Icon icon={LuPinOff} /> Unpin Note
                        </>
                    ) : (
                        <>
                            <Icon icon={LuPin} /> Pin Note
                        </>
                    )}
                </ContextMenuItem>

                <ContextMenuItem onSelect={HandleNoteLock}>
                    <Icon icon={LuLock} /> Lock Note
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onSelect={() => deleteNote(note.id)}
                >
                    <Icon icon={LuTrash} /> Delete Note
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default SidebarNoteItem;
