import { ipcMain, ipcRenderer } from "electron";

type IpcEndpointBase<T = any> = {
    [key: string]: (context: T, ...args: any) => any;
};

type Pop<T extends any[]> = T extends [any, ...infer U] ? U : never;

type EndpointParameters<T extends (...args: any[]) => any> = Pop<
    Parameters<T>
> extends never[]
    ? any[]
    : Pop<Parameters<T>>;

type EndpointFunctionWithoutContext<T extends (...args: any[]) => any> = (
    ...args: EndpointParameters<T>
) => ReturnType<T>;

type IpcEndpointWithoutContext<
    T extends Record<string, (...args: any) => any>,
> = {
    [key in keyof T]: EndpointFunctionWithoutContext<T[key]>;
};

export const CreateIpcEndpoint =
    <K extends any>() =>
    <T extends IpcEndpointBase<K>>(
        name: string,
        routerAPI: T,
    ): { name: string; router: T } => {
        return {
            name: name,
            router: routerAPI,
        };
    };

export const UseIpcEndpoint = <T extends IpcEndpointBase>(
    endpoint: { name: string; router: T },
    context?: any,
) => {
    if (ipcMain) {
        for (const key of Object.keys(endpoint.router)) {
            ipcMain.handle(`${endpoint.name}:${key}`, (_, ...args) => {
                return endpoint.router[key](context, ...args);
            });
        }
    }

    const rendererRouter = {};

    for (const key of Object.keys(endpoint.router)) {
        rendererRouter[key] = async (...args) => {
            return await ipcRenderer.invoke(`${endpoint.name}:${key}`, ...args);
        };
    }

    return rendererRouter as IpcEndpointWithoutContext<T>;
};
