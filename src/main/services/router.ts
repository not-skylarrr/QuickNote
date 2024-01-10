import { WindowEndpoint } from "./window";
import { ConfigEndpointV2 } from "./config";
import { EncryptionEndpoint } from "./encryption";
import { NotesEndpointV2 } from "./notes";
import { FolderEndpoint } from "./folders";

export const router = {
    [NotesEndpointV2.name]: NotesEndpointV2.endpoints,
    [ConfigEndpointV2.name]: ConfigEndpointV2.endpoints,
    [WindowEndpoint.name]: WindowEndpoint.endpoints,
    [EncryptionEndpoint.name]: EncryptionEndpoint.endpoints,
    [FolderEndpoint.name]: FolderEndpoint.endpoints,
};

export type IpcRouter = typeof router;
