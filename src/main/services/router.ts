import { ExportEndpoint } from "../lib/ipc";
import { ConfigEndpointV2 } from "./config";
import { EncryptionEndpoint } from "./encryption";
import { FolderEndpoint } from "./folders";
import { NotesEndpointV2 } from "./notes";
import { WindowEndpoint } from "./window";

export const IpcRouter = {
    ...ExportEndpoint(NotesEndpointV2),
    ...ExportEndpoint(ConfigEndpointV2),
    ...ExportEndpoint(WindowEndpoint),
    ...ExportEndpoint(EncryptionEndpoint),
    ...ExportEndpoint(FolderEndpoint),
};

export type IpcRouterMain = typeof IpcRouter;
