import { app } from "electron";
import path from "path";

export const GetPathFromAppRoot = (...paths: string[]) => {
    return path.join(app.getPath("appData"), "notes-app", ...paths);
};
