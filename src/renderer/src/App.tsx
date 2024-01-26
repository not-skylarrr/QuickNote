import { LuChevronLeft, LuHome } from "react-icons/lu";
import {
    Outlet,
    RouterProvider,
    createMemoryRouter,
    useNavigate,
} from "react-router-dom";
import ApplicationSearch from "./components/command";
import AppWindow, { AppWindowContent } from "./components/core/window";
import ApplicationShortcuts from "./components/shortcuts/app-shortcuts";
import AppSidebar from "./components/sidebar";
import { Button } from "./components/ui/button";
import { EmojiProvider } from "./components/ui/emoji/elem";
import Icon from "./components/ui/icon";
import { Separator } from "./components/ui/separator";
import { Toaster } from "./components/ui/sonner";
import { StartupManager } from "./components/utils/startup";
import ApplicationProviders from "./providers";
import HomeView from "./views/home";
import MultiNoteEditor from "./views/multi-note-editor";
import SettingsView from "./views/settings";

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

const NotFoundElement = () => {
    const navigate = useNavigate();

    return (
        <AppWindowContent className="items-center justify-center">
            <div className="flex w-full max-w-[480px] flex-col">
                <div className="flex flex-col gap-2">
                    <h1 className="text-center text-3xl font-semibold">
                        View Not Found
                    </h1>
                    <span className="text-center text-sm text-muted-foreground">
                        However you got here, congratulations. But there is
                        nothing here...
                    </span>
                </div>

                <Separator className="my-3" />

                <div className="grid w-full grid-cols-2 gap-2">
                    <Button onClick={() => navigate(-1)}>
                        <Icon icon={LuChevronLeft} /> Go Back
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        <Icon icon={LuHome} /> Return Home
                    </Button>
                </div>
            </div>
        </AppWindowContent>
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
    {
        path: "*",
        element: <AppLayoutElement />,
        children: [{ path: "*", element: <NotFoundElement /> }],
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
