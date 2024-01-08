import EncryptedEditor from "@renderer/components/editor/encrypted-editor";
import PlaintextEditor from "@renderer/components/editor/plaintext-editor";
import { ResizablePanel } from "@renderer/components/ui/resizable";
import { NoteManifest } from "src/preload/shared_types";

type SplitPanelProps = {
    note: NoteManifest;
};

const EditorNoteSplitPanel = ({ note }: SplitPanelProps) => {
    return (
        <ResizablePanel className="mb-4 flex flex-col" defaultSize={50}>
            <div className="mb-2 flex h-10 w-full shrink-0 flex-row items-center gap-2 px-8">
                <span className="text-sm text-muted-foreground">
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
