import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog";
import { createContext, useState } from "react";

type DialogData = {
    title: string;
    description?: string;
    onConfim: {
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
                        <AlertDialogAction
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

export default ConfirmationDialogProvider;
