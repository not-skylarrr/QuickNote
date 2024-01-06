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
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useNotes } from "@renderer/providers/notes-provider";
import { createRef, useState } from "react";
import {
    LuFile,
    LuLink,
    LuPin,
    LuPinOff,
    LuSmilePlus,
    LuSplitSquareHorizontal,
    LuTextCursorInput,
    LuTrash,
    LuX,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { NoteManifest, PlaintextNote } from "src/preload/shared_types";
import NoteDragWrapper from "./note-dnd";

type NoteSidebarItemProps = {
    note: NoteManifest;
};

const SidebarNoteItem = ({ note }: NoteSidebarItemProps) => {
    const inputRef = createRef<HTMLInputElement>();

    const navigate = useNavigate();
    const { updatePlaintextNote, deleteNote } = useNotes();
    const {
        openedNoteIds,
        focusedNote,
        isNoteOpen,
        splitNoteLeft,
        splitNoteRight,
        closeNote,
    } = useEditorNavigation();

    const [Editable, SetEditble] = useState(false);
    const [NoteTitle, SetNoteTitle] = useState(note.title);
    const [NoteIcon, SetNoteIcon] = useState(note.icon);

    const UpdateNoteData = (updates: Partial<PlaintextNote>) => {
        if (note.type == "plaintext") {
            updatePlaintextNote(note.id, updates);
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

    const HandleNoteClose = (ev: React.MouseEvent) => {
        if (!isNoteOpen(note.id)) return;

        ev.preventDefault();

        closeNote(note.id);
    };

    return (
        <NoteDragWrapper note={note}>
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
                                "group flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-sm font-normal transition-colors duration-100",
                                "hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0",
                            )}
                            data-active={isNoteOpen(note.id)}
                            onClick={HandleNoteLinkClick}
                        >
                            {NoteIcon ? (
                                <Emoji code={NoteIcon} dimensions={18} />
                            ) : (
                                <Icon icon={LuFile} dimensions={18} />
                            )}
                            <span className="border-b border-b-transparent transition-all duration-300 group-data-[collapsed=true]/sidebar:opacity-0">
                                {NoteTitle}
                            </span>

                            {note.pinned && (
                                <Icon
                                    className={cn(
                                        "ml-auto fill-muted-foreground stroke-muted-foreground",
                                        isNoteOpen(note.id) &&
                                            "group-hover:hidden",
                                    )}
                                    icon={LuPin}
                                    dimensions={12}
                                />
                            )}

                            {isNoteOpen(note.id) && (
                                <button
                                    className="ml-auto hidden group-hover:flex"
                                    onClick={HandleNoteClose}
                                >
                                    <Icon
                                        className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                                        icon={LuX}
                                        dimensions={14}
                                    />
                                </button>
                            )}
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
                        onSelect={() =>
                            UpdateNoteData({ pinned: !note.pinned })
                        }
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

                    <ContextMenuSeparator />

                    <ContextMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onSelect={() => deleteNote(note.id)}
                    >
                        <Icon icon={LuTrash} /> Delete Note
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </NoteDragWrapper>
    );
};

export default SidebarNoteItem;
