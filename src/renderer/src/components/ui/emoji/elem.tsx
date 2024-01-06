import { useEffect } from "react";
import twemoji from "twemoji";
import * as spriteSheets from "./sprites";
import { cn } from "@renderer/lib/utils";

const EmojiSvgWrapperID = "twemoji-svg";

const GetTwemojiCode = (emoji: string) => {
    const elem = document.createElement("span");
    elem.textContent = emoji;
    elem.style.display = "none";
    if (!elem.textContent) return null;

    const result = twemoji.parse(elem.textContent);
    const htmlBody = new DOMParser().parseFromString(result, "text/html");
    const imageElement = htmlBody.getElementsByClassName(
        "emoji",
    )[0] as HTMLImageElement;

    if (!imageElement) {
        console.log(result);
        console.error(`No Image Element for emoji ${emoji}`);
        return null;
    }

    const imageSource = imageElement.src;
    const [emojiFile] = imageSource.split("/").slice(-1);
    const [emojiKey] = emojiFile.split(".");

    elem.remove();

    return emojiKey;
};

const toElement = <E extends Element = HTMLElement>(html: string): E => {
    const template = document.createElement("template");
    template.innerHTML = html;

    return template.content?.firstElementChild as E;
};

export const EmojiProvider = () => {
    const CreateSvgStore = () => {
        const elem = document.getElementById(EmojiSvgWrapperID);
        if (elem) return;

        const svgDiv = document.createElement("div");
        svgDiv.style.display = "none";
        svgDiv.id = EmojiSvgWrapperID;

        document.body.appendChild(svgDiv);

        Object.values(spriteSheets).forEach((spriteContent) => {
            svgDiv.appendChild(toElement(spriteContent));
        });
    };

    useEffect(() => {
        CreateSvgStore();
    }, []);

    return null;
};

type EmojiProps = {
    code: string;
    className?: string;
    dimensions?: number;
};

export const Emoji = ({ code, className, dimensions }: EmojiProps) => {
    const emojiKey = GetTwemojiCode(code);

    return (
        <svg
            data-code={emojiKey}
            className={cn(
                "mx-0 my-auto flex shrink-0 content-start items-center justify-center self-start overflow-hidden",
                className,
            )}
            style={{
                height: `${dimensions}px`,
                width: `${dimensions}px`,
                fontSize: `${dimensions}px`,
            }}
        >
            <use xlinkHref={`#${emojiKey}`} />
        </svg>
    );
};
