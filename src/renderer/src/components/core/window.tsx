import { cn } from "@renderer/lib/utils";
import {
    VscChromeClose,
    VscChromeMaximize,
    VscChromeMinimize,
} from "react-icons/vsc";
import Icon from "../ui/icon";
import "./window.css";
import { InvokeIpc } from "@renderer/lib/ipc";

export default function AppWindow({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "h-screen w-screen overflow-hidden bg-background",
                className,
            )}
        >
            <div className="draggable fixed left-[300px] right-0 top-0 z-50 flex h-[30px]"></div>
            {children}
        </div>
    );
}

export const AppWindowContent = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn("flex h-full w-full flex-col px-8 pt-10", className)}
        >
            {children}
        </div>
    );
};

const WindowControlButtons = () => {
    return (
        <div className="ml-auto flex h-full flex-row items-center">
            <ToolbarButton onClick={() => InvokeIpc("window", "minimize")}>
                <Icon icon={VscChromeMinimize} dimensions={18} />
            </ToolbarButton>

            <ToolbarButton onClick={() => InvokeIpc("window", "maximize")}>
                <Icon icon={VscChromeMaximize} dimensions={18} />
            </ToolbarButton>

            <ToolbarButton
                className="hover:bg-destructive"
                onClick={() => InvokeIpc("window", "close")}
            >
                <Icon icon={VscChromeClose} dimensions={18} />
            </ToolbarButton>
        </div>
    );
};

const ToolbarButton = ({
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            className={cn(
                "h-full border-none px-3 outline-none transition-colors duration-200 hover:bg-accent",
                className,
            )}
            {...props}
        />
    );
};
