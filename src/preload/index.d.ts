import { ElectronAPI } from "@electron-toolkit/preload";
import type { ApiInterface } from "./index";
import { IpcRouter } from "src/main/services/router";

declare global {
    interface Window {
        api: ApiInterface;
        router: IpcRouter;
    }
}

export { IpcRouter };
