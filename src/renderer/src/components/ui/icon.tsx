import { cn } from "@renderer/lib/utils";
import { IconType } from "react-icons";

type IconProps = {
    className?: string;
    icon: IconType;
    dimensions?: number;
};

export default function Icon({ className, dimensions = 16, icon }: IconProps) {
    const IconElement = icon;

    return (
        <IconElement
            className={cn("", className)}
            height={dimensions}
            width={dimensions}
            style={{ height: `${dimensions}px`, width: `${dimensions}px` }}
        />
    );
}
