import { cn } from "@renderer/lib/utils";
import "./window.css";

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
