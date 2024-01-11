// @ts-nocheck

import { ipcMain, ipcRenderer } from "electron";

export type IpcEndpoint<
    N,
    T extends Record<string, (...args: any[]) => any>,
> = {
    name: N;
    endpoints: T;
};

export const CreateIpcEndpointV2 = <
    T extends Record<string, (...args: any[]) => any>,
    N extends string,
>(
    endpointName: N,
    endpoints: T,
): IpcEndpoint<N, T> => {
    return {
        name: endpointName,
        endpoints: endpoints,
    };
};

export const RegisterEndpoint = (endpoint: IpcEndpoint<any, any>) => {
    for (let key of Object.keys(endpoint.endpoints)) {
        ipcMain.handle(`${endpoint.name}:${key}`, async (ev, ...args) => {
            return await endpoint.endpoints[key](...args);
        });
    }
};

export const ExportEndpoint = <
    T extends IpcEndpoint<T["name"], T["endpoints"]>,
    N extends T["name"],
>(
    endpoint: T,
): { [K in T["name"]]: T["endpoints"] } => {
    return { [endpoint.name]: endpoint.endpoints };
};

export const GetEndpointFunctions = <T extends IpcEndpoint<T["endpoints"]>>(
    endpoint: T,
) => {
    return endpoint.endpoints;
};
