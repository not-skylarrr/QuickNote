// This is hella yucky
// I BEG this gets fixed one day
// But today is not that day
// I am too weak to look at this for another second
// I am just glad it works
// No matter how ugly it might be
// I love it for being great
// Not because it's pretty

import type { IpcRouterMain } from "src/preload/shared_types";

export const InvokeIpc = <
    K extends keyof IpcRouterMain,
    E extends keyof IpcRouterMain[K],
    F extends IpcRouterMain[K][E],
    A extends IpcRouterMain[K][E] extends never
        ? any[]
        : // @ts-ignore
          Parameters<IpcRouterMain[K][E]>,
>(
    group: K,
    endpoint: E,
    ...args: A
    // @ts-ignore
): ReturnType<F> => {
    return window.api.ipc.invoke(
        `${String(group)}:${endpoint.toString()}`,
        ...args,
        // @ts-ignore
    ) as ReturnType<F>;
};
