import { ThemeProvider } from "@renderer/components/utils/theme-provider";
import ConfigProvider from "./config-provider";
import NotesDataProvider from "./notes-provider";
import EditorNavigationProvider from "./editor-navigation";
import { DndContext } from "@dnd-kit/core";
import { DndProvider } from "./dnd-provider";

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
