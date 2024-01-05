import { LexicalEditor } from "lexical";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import NoteEditorTheme from "../theme";

type EditorConfigOptions = {
    namespace: string;
    initialState?: string;
    onError: (err: Error, editor: LexicalEditor) => void;
    nodes?: any[];
    editable: boolean;
};

export const GenerateEditorConfig = ({
    editable,
    initialState,
    namespace,
    nodes,
    onError,
}: EditorConfigOptions): InitialConfigType => {
    return {
        namespace: namespace,
        editorState: initialState ? initialState : DEFAULT_EDITOR_CONFIG,
        theme: NoteEditorTheme,
        nodes: nodes ?? [],
        onError: onError,
        editable: editable,
    };
};

export const DEFAULT_EDITOR_CONFIG =
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
