import { ContentEditable } from "@lexical/react/LexicalContentEditable";

const EditorContent = () => {
    return (
        <ContentEditable className="h-full w-full min-w-0 border-none text-foreground outline-none" />
    );
};

const EditorContentPlaceholder = () => {
    return (
        <div className="pointer-events-none absolute left-0 top-0 select-none text-muted-foreground">
            Start Typing...
        </div>
    );
};

export default EditorContent;
export { EditorContentPlaceholder };
