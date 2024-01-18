import { Emoji } from "@renderer/components/ui/emoji/elem";
import Icon from "@renderer/components/ui/icon";
import { LuFile } from "react-icons/lu";
import { NoteManifest } from "src/preload/shared_types";

type NoteDragPreviewProps = {
    note: NoteManifest;
};

const NoteDragPreview = ({ note }: NoteDragPreviewProps) => {
    return (
        <div className="flex w-full cursor-pointer flex-row items-center gap-2 rounded bg-accent px-2.5 py-1.5 text-sm font-normal duration-100">
            {note.icon ? (
                <Emoji code={note.icon} dimensions={18} />
            ) : (
                <Icon icon={LuFile} dimensions={18} />
            )}

            <span>{note.title}</span>
        </div>
    );
};

export default NoteDragPreview;
