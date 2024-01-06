import { Emoji } from "@renderer/components/ui/emoji/elem";
import Icon from "@renderer/components/ui/icon";
import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { LuFile, LuX } from "react-icons/lu";
import { NoteManifest } from "src/preload/shared_types";

export const SplitNoteItem = ({ note }: { note: NoteManifest }) => {
    const { closeNote } = useEditorNavigation();

    return (
        <div className="group relative flex w-full flex-row gap-2 overflow-x-hidden rounded bg-accent px-2.5 py-1.5">
            {note.icon ? (
                <Emoji className="shrink-0" code={note.icon} dimensions={18} />
            ) : (
                <Icon className="shrink-0" icon={LuFile} dimensions={18} />
            )}
            <span className="w-full shrink truncate text-nowrap text-sm">
                {note.title}
            </span>

            <button onClick={() => closeNote(note.id)}>
                <Icon
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 bg-accent group-hover:flex"
                    icon={LuX}
                />
            </button>
        </div>
    );
};
