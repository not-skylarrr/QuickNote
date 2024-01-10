import { ThemeProvider } from "@renderer/components/utils/theme-provider";
import ConfigProvider from "./ipc/config-provider";
import { DndProvider } from "./dnd-provider";
import EditorNavigationProvider from "./editor-navigation";
import NotesDataProvider from "./ipc/notes-provider";
import ConfirmationDialogProvider from "./dialogs/confirmation-dialog";
import EncryptionDialogProvider from "./dialogs/encryption-dialog";
import FolderDataProvider from "./ipc/folder-provider";

export default function ApplicationProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DndProvider>
            <ThemeProvider>
                <ConfigProvider>
                    <NotesDataProvider>
                        <FolderDataProvider>
                            <EditorNavigationProvider>
                                <EncryptionDialogProvider>
                                    <ConfirmationDialogProvider>
                                        {children}
                                    </ConfirmationDialogProvider>
                                </EncryptionDialogProvider>
                            </EditorNavigationProvider>
                        </FolderDataProvider>
                    </NotesDataProvider>
                </ConfigProvider>
            </ThemeProvider>
        </DndProvider>
    );
}
