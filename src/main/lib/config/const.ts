// Config Key Structure
// section.setting-name

import { z } from "zod";

// prettier-ignore
const ApplicationConfigSchema = z.object({
    "application.theme": z.union([z.literal("light"), z.literal("dark")]).optional(),
    "editor.autosave": z.boolean().optional(),
    "editor.autosaveDelay": z.number().optional(),
    "editor.openOnStartup": z.union([z.literal("recent"), z.literal("new")]).optional(),
});

type UserApplicationConfig = z.infer<typeof ApplicationConfigSchema>;
type ApplicationConfig = {
    [key in keyof UserApplicationConfig]-?: UserApplicationConfig[key];
};

type ApplicationConfigLabels = {
    [key in keyof ApplicationConfig]: {
        title: string;
        description: string;
        defaultValue: any;
        inputType: "select" | "number";
        inputOptions?: { label: string; value: ApplicationConfig[key] }[];
    };
};

const BaseApplicationConfig: ApplicationConfig = {
    "application.theme": "dark",
    "editor.autosave": true,
    "editor.autosaveDelay": 3000,
    "editor.openOnStartup": "new",
};

const ApplicationConfigLabels: ApplicationConfigLabels = {
    "application.theme": {
        title: "Application Theme",
        description: "The theme used by the application",
        defaultValue: "dark",
        inputType: "select",
        inputOptions: [
            { label: "Dark", value: "dark" },
            { label: "Light", value: "light" },
        ],
    },
    "editor.autosave": {
        title: "Editor Autosave",
        description:
            "Whether the editor will autosave content after a duration of no changes",
        defaultValue: false,
        inputType: "select",
        inputOptions: [
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
        ],
    },
    "editor.autosaveDelay": {
        title: "Autosave Delay",
        description:
            "The amount of time the editor will delay autosaving without a change being made",
        defaultValue: 3000,
        inputType: "number",
    },
    "editor.openOnStartup": {
        title: "Open on Startup",
        description:
            "Whether the editor opens a new note or opens the most recent note on startup",
        defaultValue: "new",
        inputType: "select",
        inputOptions: [
            { label: "New Note", value: "new" },
            { label: "Recent Note", value: "recent" },
        ],
    },
};

export {
    ApplicationConfigSchema,
    BaseApplicationConfig,
    ApplicationConfigLabels,
};
export type { ApplicationConfig, UserApplicationConfig };
