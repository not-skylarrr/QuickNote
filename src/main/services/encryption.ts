import { createCipheriv, createDecipheriv, pbkdf2Sync } from "crypto";
import { EncryptedNote, PlaintextNote } from "../../preload/shared_types";
import {
    GenerateInitialEncryptionValues,
    GetAuthTagFromContent,
    GetEncryptionKey,
    GetIvFromContent,
    GetKeySaltFromContent,
    HashString,
} from "../lib/encryption";
import { CreateIpcEndpoint } from "../lib/ipc";

type EncryptionActionResponse<T = any> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          error: string;
      };

export const EncryptionEndpoint = CreateIpcEndpoint("encryption", {
    generateKey: (note: EncryptedNote, password: string) => {
        const contentBuffer = Buffer.from(note.content, "base64");
        const encryptionSalt = contentBuffer.subarray(0, 17);

        const keyBuffer = pbkdf2Sync(
            password,
            encryptionSalt,
            100,
            256,
            "sha-256",
        );
        return keyBuffer.toString("base64");
    },

    decryptNote: (
        note: EncryptedNote,
        passwordString: string,
    ): EncryptionActionResponse<PlaintextNote> => {
        try {
            const contentBuffer = Buffer.from(note.content, "base64");

            const KeySalt = GetKeySaltFromContent(contentBuffer);
            const Iv = GetIvFromContent(contentBuffer);
            const AuthTag = GetAuthTagFromContent(contentBuffer);

            const DecryptionKey = GetEncryptionKey(passwordString, KeySalt);
            const HashedDecryptionKey = HashString(
                DecryptionKey.toString("base64"),
            );

            if (HashedDecryptionKey != note.encryptionKeyHash)
                return { success: false, error: "Incorrect Password" };

            const deciper = createDecipheriv("aes-256-gcm", DecryptionKey, Iv);
            deciper.setAuthTag(AuthTag);

            const decryptedContentBuffer = Buffer.concat([
                deciper.update(contentBuffer.subarray(Iv.length + 33)),
                deciper.final(),
            ]);

            return {
                success: true,
                data: {
                    type: "plaintext",
                    id: note.id,
                    title: note.id,
                    icon: note.icon,
                    content: JSON.parse(decryptedContentBuffer.toString()),
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                    parentFolder: note.parentFolder,
                    pinned: note.pinned,
                    tags: note.tags,
                },
            };
        } catch (e) {
            return { success: false, error: "An Error Occurred" };
        }
    },

    encryptNote: (
        note: PlaintextNote,
        passwordString: string,
    ): EncryptionActionResponse<EncryptedNote> => {
        const [KeySalt, Iv] = GenerateInitialEncryptionValues();

        const EncryptionKey = GetEncryptionKey(passwordString, KeySalt);
        const EncryptionKeyHash = HashString(EncryptionKey.toString("base64"));

        const cipher = createCipheriv("aes-256-gcm", EncryptionKey, Iv);

        const noteContentBuffer = Buffer.from(JSON.stringify(note.content));
        const encryptedContentBuffer = Buffer.concat([
            cipher.update(noteContentBuffer),
            cipher.final(),
        ]);
        const AuthTag = cipher.getAuthTag();

        const IvLength = Buffer.alloc(1);
        IvLength.writeUInt8(Iv.length, 0);

        const concatenatedContentBuffer = Buffer.concat([
            IvLength,
            Iv,
            AuthTag,
            KeySalt,
            encryptedContentBuffer,
        ]);

        return {
            success: true,
            data: {
                type: "encrypted",
                id: note.id,
                title: note.title,
                icon: note.icon,
                content: concatenatedContentBuffer.toString("base64"),
                encryptionKeyHash: EncryptionKeyHash,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                parentFolder: note.parentFolder,
                pinned: note.pinned,
                tags: note.tags,
            },
        };
    },
});
