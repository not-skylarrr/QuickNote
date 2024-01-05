import {
    HEADING,
    QUOTE,
    CODE,
    INLINE_CODE,
    UNORDERED_LIST,
    ORDERED_LIST,
    HIGHLIGHT,
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    STRIKETHROUGH,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    LINK,
} from "@lexical/markdown";

export const DEFAULT_EDITOR_STATE = {
    root: {
        children: [
            {
                children: [],
                direction: null,
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
};

export const MarkdownTransformers = [
    HEADING,
    QUOTE,
    CODE,
    INLINE_CODE,
    UNORDERED_LIST,
    ORDERED_LIST,
    HIGHLIGHT,
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    STRIKETHROUGH,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    LINK,
];
