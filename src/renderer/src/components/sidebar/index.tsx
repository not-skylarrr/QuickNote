import { useEditorNavigation } from "@renderer/providers/editor-navigation";
import { useFolders } from "@renderer/providers/ipc/folder-provider";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import SidebarFolderItem from "./components/folder/sidebar-item";
import SidebarNoteItem from "./components/note/sidebar-item";
import { SidebarTabProvider } from "./components/tabs";
import { FolderTab, FolderTabWrapper } from "./components/tabs/folder-tabs";

export default function AppSidebar() {
    const { notes } = useNotes();
    const { folders } = useFolders();

    return (
        <SidebarTabProvider>
            <FolderTabWrapper>
                <RootTabFolder />
                {folders.map((folder) => {
                    const folderNotes = notes.filter(
                        (n) => n.parentFolder == folder.id,
                    );

                    return (
                        <FolderTab tabID={folder.id}>
                            <div className="flex flex-col gap-1 px-2">
                                <span className="mb-1 pl-[2px] text-xs font-medium text-muted-foreground opacity-100 transition-opacity duration-200 group-data-[collapsed=true]/sidebar:opacity-0">
                                    {folder.title}
                                </span>
                                {folderNotes.length == 0 && (
                                    <span className="py-4 text-center text-xs text-muted-foreground">
                                        Folder is Empty
                                    </span>
                                )}
                                {folderNotes.map((n) => {
                                    return (
                                        <SidebarNoteItem key={n.id} note={n} />
                                    );
                                })}
                            </div>
                        </FolderTab>
                    );
                })}
            </FolderTabWrapper>
        </SidebarTabProvider>
    );
}

const RootTabFolder = () => {
    const { notes } = useNotes();
    const { folders } = useFolders();
    const { openedNoteIds } = useEditorNavigation();

    const RootNotes = notes.filter((n) => n.parentFolder == null);

    return (
        <FolderTab tabID="root" defaultTab>
            {folders.length > 0 && (
                <div className="flex flex-col gap-1 px-2">
                    <span className="mb-1 pl-[2px] text-xs font-medium text-muted-foreground opacity-100 transition-opacity duration-200 group-data-[collapsed=true]/sidebar:opacity-0">
                        Folders
                    </span>
                    {folders.map((f) => {
                        return <SidebarFolderItem key={f.id} folder={f} />;
                    })}
                </div>
            )}

            {RootNotes.length > 0 && (
                <div className="flex flex-col gap-1 px-2">
                    <span className="mb-1 pl-[2px] text-xs font-medium text-muted-foreground opacity-100 transition-opacity duration-200 group-data-[collapsed=true]/sidebar:opacity-0">
                        Notes
                    </span>
                    {RootNotes.map((n) => {
                        if (
                            openedNoteIds.length == 2 &&
                            openedNoteIds.includes(n.id)
                        )
                            return null;
                        return <SidebarNoteItem key={n.id} note={n} />;
                    })}
                </div>
            )}
        </FolderTab>
    );
};
