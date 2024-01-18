import { EditorThemeClasses } from "lexical";

const NoteEditorTheme: EditorThemeClasses = {
    ltr: "ltr",
    rtl: "rtl",
    paragraph: "leading-normal",
    quote: "text-muted-foreground border-l-[2px] bg-muted/50 border-l-border pl-4 py-0.5 my-1",
    heading: {
        h1: "text-4xl font-semibold leading-tight mb-2",
        h2: "text-3xl font-semibold leading-tight mb-2",
        h3: "text-2xl font-semibold leading-normal mb-1",
        h4: "text-xl font-semibold leading-relaxed mb-1",
        h5: "text-lg font-semibold leading-relaxed mb-1",
        h6: "text-lg font-medium leading-relaxed mb-1",
    },
    hashtag: "text-muted-foreground border-b border-b-border",
    text: {
        bold: "font-semibold",
        italic: "italic",
        strikethrough: "line-through",
        underline: "underline",
    },
    list: {
        ul: "list-disc list-outside py-1 pl-6",
        ol: "list-decimal list-outside py-1 pl-6",
    },
    link: "text-muted-foreground underline",
    code: "bg-muted w-full block p-2 rounded border-border border text-sm",
    codeHighlight: {
        atrule: "dark:text-[hsl(350,40%,70%)]",
        attr: "dark:text-[hsl(350,40%,70%)]",
        boolean: "dark:text-[#FAE3C6]",
        builtin: "dark:text-[#fab0cb]",
        cdata: "text-muted-foreground",
        char: "dark:text-[hsl(350,40%,70%)]",
        class: "text-[hsl(85,91%,83%)] dark:text-[hsl(85,91%,83%)]",
        "class-name": "text-[hsl(85,91%,83%)] dark:text-[hsl(85,91%,83%)]",
        comment: "text-muted-foreground",
        constant: "text-[hsl(286,60%,48%)] dark:text-[hsl(286,60%,73%)]",
        deleted: "dark:text-[#FAE3C6]",
        doctype: "text-muted-foreground",
        entity: "dark:text-[#fab0cb]",
        function: "text-[hsl(85,91%,50%)] dark:text-[hsl(85,91%,83%)]",
        important: "dark:text-[#e90]",
        inserted: "dark:text-[hsl(350,40%,70%)]",
        keyword: "text-[hsl(286,60%,48%)] dark:text-[hsl(286,60%,73%)]",
        namespace: "text-muted-foreground",
        number: "dark:text-[#FAE3C6]",
        operator: "text-muted-foreground",
        prolog: "text-muted-foreground",
        property: "dark:text-[#FAE3C6]",
        punctuation: "text-muted-foreground",
        regex: "dark:text-[#e90]",
        selector: "dark:text-[hsl(350,40%,70%)]",
        string: "dark:text-[#fab0cb]",
        symbol: "dark:text-[#FAE3C6]",
        tag: "dark:text-[#FAE3C6]",
        url: "dark:text-[#fab0cb]",
        variable: "dark:text-[#fab0cb]",
    },
};

// (28)
// attrule, attr, chat, inserted, selector (5)
// boolean, deleted, number, property, symbol, tag (6)
// class, class-name, function, (3)
// builtin, entity, string, url, variable (5)
// cdata, comment, doctype, namespace, operator, prolog, punctuation, (7)
// constant, keyword (2)
// regex, important (2)

export default NoteEditorTheme;
