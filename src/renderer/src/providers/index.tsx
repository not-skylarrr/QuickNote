import { ThemeProvider } from "@renderer/components/utils/theme-provider";
import ConfigProvider from "./config-provider";
import NotesDataProvider from "./notes-provider";

export default function ApplicationProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <ConfigProvider>
                <NotesDataProvider>{children}</NotesDataProvider>
            </ConfigProvider>
        </ThemeProvider>
    );
}
