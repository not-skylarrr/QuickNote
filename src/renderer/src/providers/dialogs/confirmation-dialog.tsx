import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog";
import { cn } from "@renderer/lib/utils";
import { createContext, useContext, useState } from "react";

type DialogData = {
    title: string;
    description?: string;
    onConfim: {
        destructive?: boolean;
        label: string;
        action: () => void;
    };
    onCancel?: {
        action: () => void;
    };
};

type ConfirmationDialogContext = {
    dialog: DialogData | null;
    openDialog: (data: DialogData) => void;
};

const ConfirmationDialogContext = createContext<
    ConfirmationDialogContext | undefined
>(undefined);

const ConfirmationDialogProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [DialogOpen, SetDialogOpen] = useState(false);
    const [DialogData, SetDialogData] = useState<DialogData | null>(null);

    const OpenDialog = (data: DialogData) => {
        SetDialogOpen(true);
        SetDialogData(data);
    };

    return (
        <ConfirmationDialogContext.Provider
            value={{ dialog: DialogData, openDialog: OpenDialog }}
        >
            {children}

            <AlertDialog
                open={DialogOpen && DialogData != null}
                onOpenChange={SetDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{DialogData?.title}</AlertDialogTitle>
                        {DialogData?.description && (
                            <AlertDialogDescription>
                                {DialogData.description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className={cn(
                                DialogData?.onConfim.destructive &&
                                    "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                            )}
                            onClick={() => DialogData?.onConfim.action()}
                        >
                            {DialogData?.onConfim.label}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmationDialogContext.Provider>
    );
};

const useConfirmation = () => {
    const ctx = useContext(ConfirmationDialogContext);
    if (!ctx)
        throw new Error(
            "No ConfirmationDialogProvider found when calling useConfirmation",
        );
    return ctx;
};

export default ConfirmationDialogProvider;
export { useConfirmation };
