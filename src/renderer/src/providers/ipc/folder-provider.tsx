import { InvokeIpc } from "@renderer/lib/ipc";
import { createContext, useContext, useEffect, useState } from "react";
import type { FolderManifest } from "src/main/lib/folders/consts";

type FolderDataContext = {
    folders: FolderManifest[];
    createFolder: (
        name: string,
        options?: Omit<Partial<FolderManifest>, "id" | "createdAt">,
    ) => Promise<FolderManifest>;
    updateFolder: (
        folderID: string,
        updates: Partial<FolderManifest>,
    ) => Promise<FolderManifest | null>;
    deleteFolder: (folderID: string) => void;
};

const FolderDataContext = createContext<FolderDataContext | undefined>(
    undefined,
);

const FolderDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [Folders, SetFoldersState] = useState<FolderManifest[]>([]);

    const SetFolders = (folders: FolderManifest[]) => {
        folders.sort((a, b) => {
            if (a.pinned && !b.pinned) {
                return -1;
            } else if (!a.pinned && b.pinned) {
                return 1;
            } else {
                return a.title < b.title ? -1 : 1;
            }
        });
        SetFoldersState(folders);
    };

    const CreateFolder = async (
        name: string,
        options?: Omit<Partial<FolderManifest>, "id" | "createdAt">,
    ) => {
        const folder = await InvokeIpc("folders", "create", name, options);
        const folderArray = [...Folders, folder];
        SetFolders(folderArray);
        return folder;
    };

    const UpdateFolder = async (
        folderID: string,
        updates: Partial<FolderManifest>,
    ) => {
        const folderIndex = Folders.findIndex((f) => f.id == folderID);
        if (folderIndex == -1) return null;

        const updatedFolder = { ...Folders[folderIndex], ...updates };
        const success = await InvokeIpc(
            "folders",
            "update",
            folderID,
            updatedFolder,
        );

        if (success) {
            const clonedFolderArray = [...Folders];
            clonedFolderArray.splice(folderIndex, 1, updatedFolder);
            SetFolders(clonedFolderArray);
            return updatedFolder;
        }

        return null;
    };

    const DeleteFolder = async (folderID: string) => {
        const folderIndex = Folders.findIndex((f) => f.id == folderID);
        if (folderIndex == -1) return;

        const success = await InvokeIpc("folders", "delete", folderID);

        if (!success) return;

        const clonedFolderArray = [...Folders];
        clonedFolderArray.splice(folderIndex, 1);
        SetFolders(clonedFolderArray);
    };

    const FetchInitialData = async () => {
        const folders = await InvokeIpc("folders", "get");
        SetFolders(folders);
    };

    useEffect(() => {
        FetchInitialData();
    }, []);

    return (
        <FolderDataContext.Provider
            value={{
                folders: Folders,
                createFolder: CreateFolder,
                updateFolder: UpdateFolder,
                deleteFolder: DeleteFolder,
            }}
        >
            {children}
        </FolderDataContext.Provider>
    );
};

const useFolders = () => {
    const ctx = useContext(FolderDataContext);
    if (!ctx)
        throw new Error("No FolderDataProvider found when calling useFolders");
    return ctx;
};

export default FolderDataProvider;
export { useFolders };
