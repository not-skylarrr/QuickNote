import { ThemeProvider } from "@renderer/components/utils/theme-provider";
import ConfigProvider from "./config-provider";
import NotesDataProvider from "./notes-provider";
import EditorNavigationProvider from "./editor-navigation";

export default function ApplicationProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <ConfigProvider>
                <NotesDataProvider>
                    <EditorNavigationProvider>
                        {children}
                    </EditorNavigationProvider>
                </NotesDataProvider>
            </ConfigProvider>
        </ThemeProvider>
    );
}
