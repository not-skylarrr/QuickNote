import AppInstance from "./classes/instance";
import { UseIpcEndpoint } from "./lib/ipc";
import { ConfigEndpoint } from "./services/config";
import { NotesEndpoint } from "./services/notes";
import { WindowEndpoint } from "./services/window";

const instance = new AppInstance({
    window: {
        height: 900,
        width: 1200,
        frame: false,
        webPreferences: {
            spellcheck: false,
        },
    },
});

UseIpcEndpoint(ConfigEndpoint, { instance: instance });
UseIpcEndpoint(NotesEndpoint);
UseIpcEndpoint(WindowEndpoint, { instance: instance });
