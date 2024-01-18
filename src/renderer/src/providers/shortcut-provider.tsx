import { createId } from "@paralleldrive/cuid2";
import { ParseShortcutString, ShortcutData } from "@renderer/lib/shortcut";
import { createContext, useContext, useEffect, useState } from "react";

type RegisteredShortcut = ShortcutData & {
    id: string;
};

type ShortcutContext = {
    shortcuts: RegisteredShortcut[];
    registerShortcut: (shortcut: string) => string | null;
    removeShortcut: (shortcutID: string) => void;
};

const ShortcutContext = createContext<ShortcutContext | undefined>(undefined);

const ShortcutProvider = ({ children }: { children: React.ReactNode }) => {
    const [Shortcuts, SetShortcuts] = useState<RegisteredShortcut[]>([]);

    const RegisterShortcut = (shortcutString: string) => {
        const shortcutID = createId();
        const shortcut = ParseShortcutString(shortcutString);
        if (!shortcut) return null;

        SetShortcuts((curr) => {
            curr.push({ id: shortcutID, ...shortcut });
            return curr;
        });

        return shortcutID;
    };

    const RemoveShortcut = (shortcutID) => {
        SetShortcuts((curr) => curr.filter((s) => s.id != shortcutID));
    };

    const HandleDocumentKeyDown = (ev: KeyboardEvent) => {
        const matchingShortcut = Shortcuts.find(
            (s) => DoesEventMatchShortcut(ev, s) == true,
        );
        if (!matchingShortcut) return;

        const event = new CustomEvent("shortcut-triggered", {
            detail: matchingShortcut.id,
        });
        document.dispatchEvent(event);
    };

    const DoesEventMatchShortcut = (
        event: KeyboardEvent,
        shortcut: RegisteredShortcut,
    ) => {
        let match = true;

        if (event.key.toUpperCase() != shortcut.key) {
            match = false;
        }
        if (event.shiftKey != shortcut.shift) {
            match = false;
        }
        if (event.altKey != shortcut.alt) {
            match = false;
        }
        if (event.ctrlKey != shortcut.ctrl) {
            match = false;
        }

        return match;
    };

    useEffect(() => {
        document.addEventListener("keydown", HandleDocumentKeyDown);

        return () => {
            document.removeEventListener("keydown", HandleDocumentKeyDown);
        };
    }, [Shortcuts]);

    return (
        <ShortcutContext.Provider
            value={{
                shortcuts: Shortcuts,
                registerShortcut: RegisterShortcut,
                removeShortcut: RemoveShortcut,
            }}
        >
            {children}
        </ShortcutContext.Provider>
    );
};

const useShortcut = (
    shortcut: string,
    callback: () => void,
    deps: any[] = [],
) => {
    const ctx = useContext(ShortcutContext);
    if (!ctx)
        throw new Error("No ShortcutProvider found when calling useShortcut");

    const [ShortcutID, SetShortcutID] = useState<string | null>(null);

    const HandleShortcutTriggerEvent = (ev: CustomEvent<string>) => {
        if (ev.detail != ShortcutID) return;
        callback();
    };

    useEffect(() => {
        const id = ctx.registerShortcut(shortcut);
        if (!id) return;

        SetShortcutID(id);

        return () => {
            ctx.removeShortcut(id);
            SetShortcutID(null);
        };
    }, [shortcut]);

    useEffect(() => {
        // @ts-expect-error
        document.addEventListener(
            "shortcut-triggered",
            HandleShortcutTriggerEvent,
        );

        return () => {
            // @ts-expect-error
            document.removeEventListener(
                "shortcut-triggered",
                HandleShortcutTriggerEvent,
            );
        };
    }, [ShortcutID, callback, ...deps]);
};

const InvokeShortcut = (shortcutString: string) => {
    const shortcut = ParseShortcutString(shortcutString);
    if (!shortcut) return;

    const keyboardEvent = new KeyboardEvent("keydown", {
        key: shortcut.key,
        ctrlKey: shortcut.ctrl,
        altKey: shortcut.alt,
        shiftKey: shortcut.shift,
    });

    document.dispatchEvent(keyboardEvent);
};

export default ShortcutProvider;
export { useShortcut, InvokeShortcut };
