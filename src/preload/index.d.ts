import { ElectronAPI } from "@electron-toolkit/preload";
import type { ApiInterface } from "./index";

declare global {
    interface Window {
        api: ApiInterface;
    }
}
