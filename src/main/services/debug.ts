import { app, shell } from "electron";
import { CreateIpcEndpoint } from "../lib/ipc";
import { GetFilePathFromStorageSpace } from "../lib/storage";

const CoreDebugObject = {
    startupTime: new Date(),
    version: app.getVersion(),
};

export type CoreDebugData = typeof CoreDebugObject;

export const DebugEndpoint = CreateIpcEndpoint("debug", {
    openNoteAsFile: (noteID: string) => {
        const filePath = GetFilePathFromStorageSpace(
            "notes",
            `${noteID}.qnote`,
        );
        shell.showItemInFolder(filePath);
    },
});
