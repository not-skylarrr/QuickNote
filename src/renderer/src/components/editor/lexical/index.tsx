import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { EditorState } from "lexical";
import EditorContent, {
    EditorContentPlaceholder,
} from "./components/content-editable";
import { MarkdownTransformers } from "./constants";
import { GenerateEditorConfig } from "./lib/editor-config";
import CodeHighlightPlugin from "./plugins/code-highlight";
import { HashtagPlugin } from "./plugins/hashtag";
import OnChangePlugin from "./plugins/onchange";
import FloatingToolbarPlugin from "./plugins/toolbar";

const URL_MATCHER =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
    (text: string) => {
        const match = URL_MATCHER.exec(text);
        if (match === null) {
            return null;
        }
        const fullMatch = match[0];
        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith("http")
                ? fullMatch
                : `https://${fullMatch}`,
            // attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
        };
    },
];

function onError(error) {
    console.error(error);
}

type NoteEditorProps = {
    initialState?: string | Record<string, any>;
    onChange: (state: Record<string, any>) => void;
};

const TextEditor = ({ onChange, initialState }: NoteEditorProps) => {
    const initialConfig = GenerateEditorConfig({
        namespace: "Note Editor",
        editable: true,
        initialState: JSON.stringify(initialState),
        onError: onError,
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode,
            HashtagNode,
        ],
    });

    const HandleChange = (state: EditorState) => {
        onChange(state);
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="relative h-full w-full p-0">
                <RichTextPlugin
                    contentEditable={<EditorContent />}
                    placeholder={<EditorContentPlaceholder />}
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={MarkdownTransformers} />
            <HashtagPlugin />
            <HistoryPlugin />
            <AutoLinkPlugin matchers={MATCHERS} />
            <ListPlugin />
            <CodeHighlightPlugin />
            <OnChangePlugin onChange={HandleChange} />
            <FloatingToolbarPlugin />
        </LexicalComposer>
    );
};

export default TextEditor;
