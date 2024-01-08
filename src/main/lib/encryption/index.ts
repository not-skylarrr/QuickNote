// Encrypted Buffer Format
// Byte 0: Length of Initialization Vector
// Bytes 1 -> ivLength + 1: Initialization Vector
// Bytes ivLength + 1 -> 32: Auth Tag
// Bytes ivLength + 1 + 16 -> 48: Encryption Key Salt;
// Bytes 49+ Actual Content

import { createHash, getRandomValues, pbkdf2Sync } from "crypto";

export const GenerateInitialEncryptionValues = () => {
    const EncryptionKeySalt = Buffer.from(getRandomValues(new Uint8Array(16)));
    const EncryptionInitializationVector = Buffer.from(
        getRandomValues(new Uint8Array(12)),
    );

    return [EncryptionKeySalt, EncryptionInitializationVector] as const;
};

export const GetEncryptionKey = (passwordString: string, keySalt: Buffer) => {
    return pbkdf2Sync(passwordString, keySalt, 100, 32, "SHA256");
};

export const GetIvFromContent = (content: Buffer) => {
    const ivLength = content.readUint8(0);
    const iv = content.subarray(1, ivLength + 1);
    return iv;
};

export const GetAuthTagFromContent = (content: Buffer) => {
    const ivLength = content.readUint8(0);
    const authTag = content.subarray(ivLength + 1, ivLength + 17);
    return authTag;
};

export const GetKeySaltFromContent = (content: Buffer) => {
    const ivLength = content.readUint8(0);
    const salt = content.subarray(ivLength + 17, ivLength + 33);
    return salt;
};

export const HashString = (string: string) => {
    return createHash("SHA256").update(string).digest("base64");
};
