import { z } from "zod";

export const PlaintextNoteSchema = z.object({
    type: z.literal("plaintext"),
    id: z.string(),
    title: z.string(),
    icon: z.string().nullable(),
    content: z.record(z.any()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    parentFolder: z.string().nullable(),
    pinned: z.boolean().default(false),
});

export const EncryptedNoteSchema = z.object({
    type: z.literal("encrypted"),
    id: z.string(),
    title: z.string(),
    icon: z.string().nullable(),
    content: z.string(),
    encryptionKeyHash: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    parentFolder: z.string().nullable(),
    pinned: z.boolean().default(false),
});

export const NoteSchema = z.union([PlaintextNoteSchema, EncryptedNoteSchema]);
export type NoteSchema = z.infer<typeof NoteSchema>;

export const DEFAULT_EDITOR_STATE = {
    root: {
        children: [
            {
                children: [],
                direction: null,
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
};
