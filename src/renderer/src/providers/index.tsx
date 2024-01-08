import { ThemeProvider } from "@renderer/components/utils/theme-provider";
import ConfigProvider from "./config-provider";
import { DndProvider } from "./dnd-provider";
import EditorNavigationProvider from "./editor-navigation";
import NotesDataProvider from "./notes-provider";
import ConfirmationDialogProvider from "./confirmation-dialog";
import EncryptionDialogProvider from "./encryption-dialog";

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
                        <EditorNavigationProvider>
                            <EncryptionDialogProvider>
                                <ConfirmationDialogProvider>
                                    {children}
                                </ConfirmationDialogProvider>
                            </EncryptionDialogProvider>
                        </EditorNavigationProvider>
                    </NotesDataProvider>
                </ConfigProvider>
            </ThemeProvider>
        </DndProvider>
    );
}
