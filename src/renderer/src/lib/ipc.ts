// This is hella yucky
// I BEG this gets fixed one day
// But today is not that day
// I am too weak to look at this for another second
// I am just glad it works
// No matter how ugly it might be
// I love it for being great
// Not because it's pretty

import type { IpcRouterMain } from "src/preload/shared_types";

// (Apparently formatting the return type ternary breaks the typescript compiler lol)
// prettier-ignore
export const InvokeIpc = async <
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
    // @ts-ignore it works as intended but the dumb compiler wants to cry about it because of course it does
): ReturnType<F> extends Promise<any> ? ReturnType<F> : Promise<ReturnType<F>> => {
    return window.api.ipc.invoke(
        `${String(group)}:${endpoint.toString()}`,
        ...args,
    );
};
