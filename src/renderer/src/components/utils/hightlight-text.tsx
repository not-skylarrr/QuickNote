import { cn } from "@renderer/lib/utils";
import { useEffect, useState } from "react";

type HighlighTextProps = {
    children: string;
    className?: string;
    query: string;
};

type HighlightedTextArray = { content: string; highlighted: boolean }[];

const HighlightText = ({ children, className, query }: HighlighTextProps) => {
    const [HighlightedText, SetHighlightedText] =
        useState<HighlightedTextArray>([]);

    const ProcessText = () => {
        const TextSections: HighlightedTextArray = [];

        const text = children;
        const occurences = FindQueryOccurences(text);

        const letterArray = text.split("");
        letterArray.forEach((letter, index) => {
            let highlighedArea = occurences.includes(index);

            const currentArrayItem = TextSections.at(-1);

            if (!currentArrayItem) {
                TextSections.push({
                    content: letter,
                    highlighted: highlighedArea,
                });
                return;
            }

            if (
                currentArrayItem.highlighted != highlighedArea &&
                currentArrayItem.content.length >= query.length
            ) {
                TextSections.push({
                    content: letter,
                    highlighted: highlighedArea,
                });
                return;
            }

            currentArrayItem.content = currentArrayItem.content + letter;
        });

        SetHighlightedText(TextSections);
    };

    const FindQueryOccurences = (text: string, position = 0): number[] => {
        const occurenceIndex = text
            .toLowerCase()
            .indexOf(query.toLowerCase(), position);
        if (occurenceIndex == -1) return [];
        return [
            occurenceIndex,
            ...FindQueryOccurences(text, occurenceIndex + query.length),
        ];
    };

    useEffect(() => {
        if (query.length > 0) {
            ProcessText();
        }
    }, [children, query]);

    if (query.length == 0) return <span className={className}>{children}</span>;

    return (
        <span className={className}>
            {HighlightedText.map((section) => {
                return (
                    <span className={cn(section.highlighted && "underline")}>
                        {section.content}
                    </span>
                );
            })}
        </span>
    );
};

export default HighlightText;
