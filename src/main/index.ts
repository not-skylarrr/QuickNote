import AppInstance from "./classes/instance";
import "./services/router";

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
