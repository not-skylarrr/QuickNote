import {
    existsSync,
    lstatSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from "fs";
import path from "path";
import { GetPathFromAppRoot } from "./utils";

const StorageSpaces = {
    config: "Config",
    notes: "Notes",
};

type StorageSpace = keyof typeof StorageSpaces;

type StorageChangeResponse<T = any> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          error: string;
      };

type BulkFile = {
    key: string;
    content: string;
};

export const GetAllFilesFromStorageSpace = (
    space: StorageSpace,
): StorageChangeResponse<BulkFile[]> => {
    if (!StorageSpaces[space]) {
        return { success: false, error: "Invalid storage space" };
    }

    const parentDirectory = GetPathFromAppRoot(StorageSpaces[space]);
    if (!existsSync(parentDirectory))
        return { success: false, error: "Space does not exist" };

    try {
        const spaceKeys = readdirSync(parentDirectory);
        const filteredKeys = spaceKeys.filter(
            (key) => !lstatSync(path.join(parentDirectory, key)).isDirectory(),
        );

        let spaceKeyFiles: BulkFile[] = [];
        for (let key of filteredKeys) {
            const content = readFileSync(
                path.join(parentDirectory, key),
            ).toString();
            spaceKeyFiles.push({ key, content });
        }

        return { success: true, data: spaceKeyFiles };
    } catch (e) {
        return { success: false, error: "Failed to read files" };
    }
};

export const GetFileFromStorageSpace = (
    space: StorageSpace,
    key: string,
): StorageChangeResponse<string> => {
    if (!StorageSpaces[space]) {
        return { success: false, error: "Invalid storage space" };
    }

    const parentDirectory = GetPathFromAppRoot(StorageSpaces[space]);
    if (!existsSync(parentDirectory))
        return { success: false, error: "Space does not exist" };

    try {
        const filePath = path.join(parentDirectory, key.replace("../", ""));
        const fileContent = readFileSync(filePath).toString();

        return { success: true, data: fileContent };
    } catch (e) {
        return { success: false, error: "Error reading file" };
    }
};

export const WriteFileToStorageSpace = (
    space: StorageSpace,
    key: string,
    content: string,
): StorageChangeResponse => {
    if (!StorageSpaces[space]) {
        return { success: false, error: "Invalid storage space" };
    }

    const parentDirectory = GetPathFromAppRoot(StorageSpaces[space]);

    try {
        // Create the folder if it doesn't exist
        if (!existsSync(parentDirectory)) {
            mkdirSync(parentDirectory);
        }

        const filePath = path.join(parentDirectory, key);
        writeFileSync(filePath, content);
    } catch (e) {
        return { success: false, error: "Error creating file" };
    }

    return { success: true, data: undefined };
};

export const DeleteFileFromStorageSpace = (
    space: StorageSpace,
    key: string,
): StorageChangeResponse => {
    if (!StorageSpaces[space]) {
        return { success: false, error: "Invalid storage space" };
    }

    try {
        const parentDirectory = GetPathFromAppRoot(StorageSpaces[space]);
        const fileDirectory = path.join(
            parentDirectory,
            key.replace("../", ""),
        );

        rmSync(fileDirectory);
        return { success: true, data: null };
    } catch (e) {
        return { success: false, error: "Failed to remove file" };
    }
};
