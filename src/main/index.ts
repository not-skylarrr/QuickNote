import AppInstance from "./classes/instance";
import { RegisterEndpoint } from "./lib/ipc/v2";
import { ConfigEndpointV2 } from "./services/config";
import { EncryptionEndpoint } from "./services/encryption";
import { NotesEndpointV2 } from "./services/notes";
import { WindowEndpoint } from "./services/window";
import "./services/router";
import { FolderEndpoint } from "./services/folders";

new AppInstance({
    window: {
        height: 900,
        width: 1200,
        frame: false,
        webPreferences: {
            spellcheck: false,
        },
    },
});

RegisterEndpoint(NotesEndpointV2);
RegisterEndpoint(ConfigEndpointV2);
RegisterEndpoint(WindowEndpoint);
RegisterEndpoint(EncryptionEndpoint);
RegisterEndpoint(FolderEndpoint);
