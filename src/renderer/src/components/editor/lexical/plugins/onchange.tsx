import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useEffect, useState } from "react";

type OnChangePluginProps = {
  onChange: (state: EditorState) => void;
};

export default function OnChangePlugin({ onChange }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  const [CurrState, SetCurrState] = useState("");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (CurrState == JSON.stringify(editorState.toJSON())) return;
      SetCurrState(JSON.stringify(editorState.toJSON()));
      onChange(editorState);
    });
  }, [editor, onChange, CurrState]);

  return null;
}
