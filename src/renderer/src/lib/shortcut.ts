export type ShortcutData = {
    key: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
};

const ModifierKeys = ["CTRL", "ALT", "SHIFT"];

export const ParseShortcutString = (
    shortcutString: string,
): ShortcutData | null => {
    let shortcutKey: string | null = null;
    let ctrl = false;
    let alt = false;
    let shift = false;

    const shortcutKeys = shortcutString.toUpperCase().split("+");

    for (let key of shortcutKeys) {
        if (ModifierKeys.includes(key)) {
            if (key == "CTRL") ctrl = true;
            if (key == "ALT") alt = true;
            if (key == "SHIFT") shift = true;
        } else {
            shortcutKey = key;
        }
    }

    if (!shortcutKey) return null;

    return {
        key: shortcutKey,
        ctrl,
        alt,
        shift,
    };
};
