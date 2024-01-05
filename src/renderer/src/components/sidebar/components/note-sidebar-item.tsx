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
import { useNotes } from "@renderer/providers/notes-provider";
import { createRef, useState } from "react";
import {
    LuFile,
    LuLink,
    LuPin,
    LuPinOff,
    LuSmilePlus,
    LuTextCursorInput,
    LuTrash,
} from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { NoteManifest, PlaintextNote } from "src/preload/shared_types";

type NoteSidebarItemProps = {
    note: NoteManifest;
};

const SidebarNoteItem = ({ note }: NoteSidebarItemProps) => {
    const inputRef = createRef<HTMLInputElement>();
    const ItemHref = `/notes/${note.id}`;

    const { pathname } = useLocation();
    const { updatePlaintextNote, deleteNote } = useNotes();

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

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {Editable ? (
                    <div
                        className="flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-[.84rem] font-normal transition-colors duration-100 hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0"
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
                    <Link
                        to={ItemHref}
                        className="flex w-full cursor-pointer flex-row items-center gap-2 rounded px-2.5 py-1.5 text-[.84rem] font-normal transition-colors duration-100 hover:bg-accent data-[active=true]:bg-accent [&>*]:shrink-0"
                        data-active={pathname == ItemHref}
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
                                className="ml-auto fill-muted-foreground stroke-muted-foreground"
                                icon={LuPin}
                                dimensions={12}
                            />
                        )}
                    </Link>
                )}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-[200px]">
                <ContextMenuItem>
                    <Icon icon={LuLink} /> Open Note
                </ContextMenuItem>

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
