import { InvokeIpc } from "@renderer/lib/ipc";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { EncryptedNote, PlaintextNote } from "src/preload/shared_types";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

type EncryptionActionResponse<T = any> =
    | {
          success: true;
          key: string;
          data: T;
      }
    | {
          success: false;
          error: string;
      };

type UnlockNoteProps = {
    note: EncryptedNote;
    onUnlock: (response: EncryptionActionResponse<PlaintextNote>) => void;
};

export const UnlockNoteDialog = ({ note, onUnlock }: UnlockNoteProps) => {
    const [Open, SetOpen] = useState(true);

    const [Password, SetPassword] = useState("");

    const HandleDialogOpenChange = (open: boolean) => {
        if (Open && open == false) {
            SetOpen(false);

            setTimeout(() => {
                onUnlock({ success: false, error: "Cancelled by user" });
            }, 200);
        }
    };

    const HandleFormSubmit = async (ev: FormEvent) => {
        ev.preventDefault();

        const response = await InvokeIpc(
            "encryption",
            "decryptNote",
            note,
            Password,
        );

        if (!response.success) {
            if (response.error == "Incorrect Password") {
                toast.error("Incorrect Password");
                return;
            }

            SetOpen(false);
            onUnlock(response);
            return;
        }

        SetOpen(false);
        onUnlock({ ...response, key: Password });
    };

    return (
        <Dialog open={Open} onOpenChange={HandleDialogOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unlock Note</DialogTitle>
                    <DialogDescription>
                        To complete this action, you must first unlock the note
                        with your password.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={HandleFormSubmit}
                >
                    <Input
                        placeholder="Password"
                        type="password"
                        value={Password}
                        onChange={(ev) => SetPassword(ev.target.value)}
                    />
                    <DialogFooter className="items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => HandleDialogOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button>Unlock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

type LockNoteProps = {
    note: PlaintextNote;
    onLock: (response: EncryptionActionResponse<EncryptedNote>) => void;
};

export const LockNoteDialog = ({ note, onLock }: LockNoteProps) => {
    const [Open, SetOpen] = useState(true);

    const [Password, SetPassword] = useState("");
    const [ConfirmedPassword, SetConfirmedPassword] = useState("");

    const HandleDialogOpenChange = (open: boolean) => {
        if (Open && open == false) {
            SetOpen(false);

            setTimeout(() => {
                onLock({ success: false, error: "Cancelled by user" });
            }, 200);
        }
    };

    const HandleFormSubmit = async (ev: FormEvent) => {
        ev.preventDefault();

        if (Password != ConfirmedPassword)
            return toast.error("Passwords do not match");

        const response = await InvokeIpc(
            "encryption",
            "encryptNote",
            note,
            Password,
        );

        if (!response.success) {
            SetOpen(false);
            onLock(response);
            return;
        }

        SetOpen(false);
        onLock({ ...response, key: Password });
        return;
    };

    return (
        <Dialog open={Open} onOpenChange={HandleDialogOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lock Note</DialogTitle>
                    <DialogDescription>
                        To complete this action, you must first unlock the note
                        with your password.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={HandleFormSubmit}
                >
                    <Input
                        placeholder="Password"
                        type="password"
                        value={Password}
                        onChange={(ev) => SetPassword(ev.target.value)}
                    />
                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={ConfirmedPassword}
                        onChange={(ev) => SetConfirmedPassword(ev.target.value)}
                    />
                    <DialogFooter className="items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => HandleDialogOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button>Unlock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
