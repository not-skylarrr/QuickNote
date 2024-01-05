import React, { useState } from "react";
import VirtualList, { GroupByCount } from "../virtual-list";
import { Emoji } from "./elem";
import EmojiList from "./emojis.json";

type EmojiSelectorProps = {
    columns?: number;
    emojiSize?: number;
    height?: number;
    onSelect?: (emoji: string) => void;
};

export const EmojiSelector = ({
    columns = 6,
    emojiSize = 24,
    height = 300,
    onSelect,
}: EmojiSelectorProps) => {
    const [Query, SetQuery] = useState("");

    const HandleEmojiSelect = (value: string) => {
        if (onSelect) onSelect(value);
    };

    const Emojis = EmojiList.filter((e) =>
        e.name.toLowerCase().includes(Query.toLowerCase()),
    );
    const EmojiRows = GroupByCount(Emojis, columns).map((emojis) => {
        return emojis.map((e) => (
            <button
                key={`emoji-${e.char}`}
                data-name={e.name}
                data-code={e.codes}
                className="flex items-center justify-center rounded-full bg-transparent hover:bg-accent"
                style={{
                    height: `${emojiSize + 16}px`,
                    width: `${emojiSize + 16}px`,
                }}
                onClick={() => HandleEmojiSelect(e.char)}
            >
                <Emoji code={e.char} dimensions={emojiSize} />
            </button>
        ));
    });

    const HandleSearchKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key == "Enter" && onSelect) {
            const firstEmoji = Emojis[0];
            if (!firstEmoji) return;
            onSelect(firstEmoji.char);
        }
    };

    return (
        <div className="flex max-h-[400px] w-[260px] flex-col gap-3 rounded bg-popover p-2">
            <input
                placeholder="Search Emojis"
                value={Query}
                onKeyDown={HandleSearchKeyDown}
                onChange={(ev) => SetQuery(ev.target.value)}
                className="w-full rounded border-none bg-accent px-1.5 py-1 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />

            <VirtualList
                rows={EmojiRows}
                rowHeight={34}
                colCount={columns}
                listHeight={height - 60}
                overlapCount={2}
            />
        </div>
    );
};
