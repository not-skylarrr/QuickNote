import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import ApplicationSearch from "./components/command";
import AppWindow from "./components/core/window";
import AppSidebar from "./components/sidebar";
import { EmojiProvider } from "./components/ui/emoji/elem";
import { Toaster } from "./components/ui/sonner";
import { StartupManager } from "./components/utils/startup";
import ApplicationProviders from "./providers";
import NoteEditorView from "./views/note-editor";
import SettingsView from "./views/settings";

const FullscreenElement = () => {
    return (
        <AppWindow>
            <Outlet />
        </AppWindow>
    );
};

const AppLayoutElement = () => {
    return (
        <AppWindow className="flex flex-row">
            <AppSidebar />
            <Outlet />
        </AppWindow>
    );
};

function App(): JSX.Element {
    return (
        <ApplicationProviders>
            <MemoryRouter>
                <Routes>
                    {/* Place all routes with sidebar | content layout */}
                    <Route path="/" element={<AppLayoutElement />}>
                        <Route index element={<></>} />
                        <Route
                            path="/notes/:noteID"
                            element={<NoteEditorView />}
                        />
                        <Route path="/settings" element={<SettingsView />} />
                    </Route>

                    {/* Other alternative layout views */}
                    <Route path="/get-started" element={<FullscreenElement />}>
                        <Route
                            index
                            element={<span>Get Started Nerd...</span>}
                        />
                    </Route>
                </Routes>

                <Toaster />
                <EmojiProvider />
                <ApplicationSearch />
                <StartupManager />
            </MemoryRouter>
        </ApplicationProviders>
    );
}

export default App;
