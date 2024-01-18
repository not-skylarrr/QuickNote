import { ThemeProvider } from "@renderer/providers/theme-provider";
import ConfigProvider from "./ipc/config-provider";
import { DndProvider } from "./dnd-provider";
import EditorNavigationProvider from "./editor-navigation";
import NotesDataProvider from "./ipc/notes-provider";
import ConfirmationDialogProvider from "./dialogs/confirmation-dialog";
import EncryptionDialogProvider from "./dialogs/encryption-dialog";
import FolderDataProvider from "./ipc/folder-provider";
import ShortcutProvider from "./shortcut-provider";
import { SidebarTabProvider } from "@renderer/components/sidebar/components/tabs";

export default function ApplicationProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConfigProvider>
            <ThemeProvider>
                <NotesDataProvider>
                    <FolderDataProvider>
                        <EditorNavigationProvider>
                            <DndProvider>
                                <EncryptionDialogProvider>
                                    <ConfirmationDialogProvider>
                                        <ShortcutProvider>
                                            <SidebarTabProvider>
                                                {children}
                                            </SidebarTabProvider>
                                        </ShortcutProvider>
                                    </ConfirmationDialogProvider>
                                </EncryptionDialogProvider>
                            </DndProvider>
                        </EditorNavigationProvider>
                    </FolderDataProvider>
                </NotesDataProvider>
            </ThemeProvider>
        </ConfigProvider>
    );
}
