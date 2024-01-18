import { Outlet, RouterProvider, createMemoryRouter } from "react-router-dom";
import ApplicationSearch from "./components/command";
import AppWindow from "./components/core/window";
import AppSidebar from "./components/sidebar";
import { EmojiProvider } from "./components/ui/emoji/elem";
import { Toaster } from "./components/ui/sonner";
import { StartupManager } from "./components/utils/startup";
import ApplicationProviders from "./providers";
import HomeView from "./views/home";
import MultiNoteEditor from "./views/multi-note-editor";
import SettingsView from "./views/settings";
import ApplicationShortcuts from "./components/shortcuts/app-shortcuts";

const AppLayoutElement = () => {
    return (
        <AppWindow className="flex flex-row">
            <AppSidebar />
            <Outlet />

            <Toaster />
            <EmojiProvider />
            <StartupManager />
            <ApplicationSearch />
            <ApplicationShortcuts />
        </AppWindow>
    );
};

const router = createMemoryRouter([
    {
        path: "/",
        element: <AppLayoutElement />,
        children: [
            { index: true, element: <HomeView /> },
            { path: "/editor", element: <MultiNoteEditor /> },
            { path: "/settings", element: <SettingsView /> },
        ],
    },
]);

function App(): JSX.Element {
    return (
        <ApplicationProviders>
            <RouterProvider router={router} />
        </ApplicationProviders>
    );
}

export default App;
