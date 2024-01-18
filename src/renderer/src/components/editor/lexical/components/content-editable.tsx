import { ContentEditable } from "@lexical/react/LexicalContentEditable";

const EditorContent = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <ContentEditable
            className="h-full w-full min-w-0 border-none pb-8 text-foreground outline-none"
            {...props}
        />
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
