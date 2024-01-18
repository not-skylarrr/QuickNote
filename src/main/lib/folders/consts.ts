import { z } from "zod";

export const FolderManifest = z.object({
    id: z.string(),
    title: z.string().min(3).max(30),
    icon: z.string().nullable(),
    contentIds: z.array(z.string()),
    createdAt: z.coerce.date(),
    pinned: z.boolean(),
    parentFolder: z.string().nullable().default(null),
});

export type FolderManifest = z.infer<typeof FolderManifest>;
