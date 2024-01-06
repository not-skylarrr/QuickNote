import { ThemeProvider } from "@renderer/components/utils/theme-provider";
import ConfigProvider from "./config-provider";
import { DndProvider } from "./dnd-provider";
import EditorNavigationProvider from "./editor-navigation";
import NotesDataProvider from "./notes-provider";

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
                            {children}
                        </EditorNavigationProvider>
                    </NotesDataProvider>
                </ConfigProvider>
            </ThemeProvider>
        </DndProvider>
    );
}
