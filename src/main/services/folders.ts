import { createId } from "@paralleldrive/cuid2";
import { FolderManifest } from "../lib/folders/consts";
import { CreateIpcEndpoint } from "../lib/ipc";
import {
    DeleteFileFromStorageSpace,
    GetAllFilesFromStorageSpace,
    WriteFileToStorageSpace,
} from "../lib/storage";

export const FolderEndpoint = CreateIpcEndpoint("folders", {
    get: () => {
        const folderFiles = GetAllFilesFromStorageSpace("folders");
        if (!folderFiles.success) return [];

        const parsedFolderFiles = folderFiles.data
            .map((f) => {
                const parsedFolder = FolderManifest.safeParse(
                    JSON.parse(f.content),
                );
                if (!parsedFolder.success) return null;
                return parsedFolder.data;
            })
            .filter((f) => f != null) as FolderManifest[];

        return parsedFolderFiles;
    },
    create: async (
        folderName: string,
        options?: Omit<Partial<FolderManifest>, "id" | "createdAt">,
    ) => {
        const folder: FolderManifest = {
            id: createId(),
            title: folderName,
            icon: null,
            contentIds: [],
            createdAt: new Date(),
            pinned: false,
            parentFolder: null,
            ...options,
        };

        WriteFileToStorageSpace(
            "folders",
            `${folder.id}.json`,
            JSON.stringify(folder, null, 4),
        );

        return folder;
    },
    update: async (
        folderID: string,
        newFolder: FolderManifest,
    ): Promise<boolean> => {
        const parsedFolder = FolderManifest.parse(newFolder);
        if (!parsedFolder) return false;

        const result = WriteFileToStorageSpace(
            "folders",
            `${folderID}.json`,
            JSON.stringify(parsedFolder, null, 4),
        );
        return result.success;
    },
    delete: (folderID: string) => {
        return DeleteFileFromStorageSpace("folders", `${folderID}.json`)
            .success;
    },
});
