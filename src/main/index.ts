import AppInstance from "./classes/instance";
import { is } from "@electron-toolkit/utils";
import "./services/router";

new AppInstance({
    window: {
        height: 900,
        width: 1200,
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "hsl(200, 5%, 3.9%)",
            symbolColor: "hsl(0, 0%, 98%)",
            height: 30,
        },
        webPreferences: {
            spellcheck: false,
            devTools: is.dev ? true : false,
        },
    },
});
