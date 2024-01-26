import EncryptedEditor from "@renderer/components/editor/encrypted-editor";
import PlaintextEditor from "@renderer/components/editor/plaintext-editor";
import { ResizablePanel } from "@renderer/components/ui/resizable";
import { useFolders } from "@renderer/providers/ipc/folder-provider";
import { NoteManifest } from "src/preload/shared_types";

type SplitPanelProps = {
    note: NoteManifest;
};

const EditorNoteSplitPanel = ({ note }: SplitPanelProps) => {
    const { folders } = useFolders();
    const noteFolder = folders.find((f) => f.id == note.parentFolder);

    return (
        <ResizablePanel className="flex flex-col" defaultSize={50}>
            <div className="flex h-10 w-full shrink-0 flex-row items-center gap-2 px-8">
                <span className="text-sm text-muted-foreground">
                    {noteFolder && `${noteFolder.title} / `}
                    {note.title}
                </span>
            </div>
            <div className="h-full overflow-y-auto px-8">
                {note.type == "plaintext" && (
                    <PlaintextEditor key={note.id} note={note} />
                )}

                {note.type == "encrypted" && (
                    <EncryptedEditor key={note.id} note={note} />
                )}
            </div>
        </ResizablePanel>
    );
};

export default EditorNoteSplitPanel;
