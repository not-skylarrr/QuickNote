// @ts-nocheck

import { ipcMain } from "electron";

type IpcEndpointRecord = Record<string, (...args: any[]) => any>;

export type IpcEndpoint<N extends string, T extends IpcEndpointRecord> = {
    name: N;
    endpoints: T;
};

export const CreateIpcEndpoint = <
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
    T extends IpcEndpoint<
        T["name"],
        T["endpoints"] extends IpcEndpointRecord ? T["endpoints"] : {}
    >,
>(
    endpoint: T,
): { [K in T["name"]]: T["endpoints"] } => {
    RegisterEndpoint(endpoint);
    return { [endpoint.name]: endpoint.endpoints };
};

// Experimental (Doesn't work at all...)
export const CreateIpcRouter = <
    T extends ReadonlyArray<IpcEndpoint<T["name"], T["endpoints"]>>,
>(
    ...endpoints: T
) => {
    let routerObject: {
        [K in T[number]["name"]]: T[number] extends IpcEndpoint<
            K,
            Record<string, any>
        >
            ? T[number]["endpoints"]
            : never;
    } = {};

    for (let endpoint of endpoints) {
        RegisterEndpoint(endpoint);

        routerObject[endpoint.name] = endpoint.endpoints;
    }

    return routerObject;
};
