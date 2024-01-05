import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import Icon from "@renderer/components/ui/icon";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@renderer/components/ui/toggle-group";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useCallback, useEffect, useState } from "react";
import {
    LuBold,
    LuCode,
    LuItalic,
    LuStrikethrough,
    LuUnderline,
} from "react-icons/lu";
import { ArrayDiff } from "../../utils";
import { cn } from "@renderer/lib/utils";

type Position = { top: number; left: number };

const FloatingToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const [Display, SetDisplay] = useState(false);
    const [Position, SetPosition] = useState<Position | null>(null);
    const [FormattingState, SetFormattingState] = useState<string[]>([]);

    const HandleToolbarValueChange = (formatting: string[]) => {
        const [newItems, removedItems] = ArrayDiff(FormattingState, formatting);

        const changes = [...newItems, removedItems];

        for (let change of changes) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, change);
        }
    };

    const UpdateToolbarPosition = useCallback(() => {
        const rootElement = editor.getRootElement();

        if (!rootElement) return;
        if (editor.isComposing() || rootElement !== document.activeElement) {
            SetPosition(null);
            return;
        }

        const selection = $getSelection();

        if (
            $isRangeSelection(selection) &&
            !selection.anchor.is(selection.focus)
        ) {
            const domSelection = getSelection();
            const domRange =
                domSelection?.rangeCount != 0 && domSelection?.getRangeAt(0);

            if (!domRange) return;

            const ToolbarHeight = 46;
            const ToolbarWidth = 226;

            const ToolbarMargin = 8;

            const ToolbarTotalHeight = ToolbarHeight + ToolbarMargin;

            const rootBounds = rootElement.getBoundingClientRect();
            const selectionBounds = domRange.getBoundingClientRect();

            let centerX = selectionBounds.x + selectionBounds.width / 2;
            let topY = selectionBounds.top - ToolbarTotalHeight;

            if (topY < rootBounds.top) {
                topY = selectionBounds.bottom + ToolbarMargin;
            }

            if (centerX < rootBounds.left + ToolbarWidth / 2) {
                centerX =
                    centerX + rootBounds.left + ToolbarWidth / 2 - centerX;
            }

            if (centerX > rootBounds.right - ToolbarWidth / 2) {
                centerX =
                    centerX + (rootBounds.right - ToolbarWidth / 2 - centerX);

                console.log(
                    centerX,
                    rootBounds.right - ToolbarWidth / 2 - centerX,
                );
            }

            SetPosition({ top: topY, left: centerX });
        } else {
            SetPosition(null);
        }
    }, [editor]);

    // Read selection formatting
    useEffect(() => {
        const unregisterListener = editor.registerUpdateListener(
            ({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection)) return;

                    UpdateToolbarPosition();

                    let formattingArray: string[] = [];

                    if (selection.hasFormat("bold"))
                        formattingArray.push("bold");
                    if (selection.hasFormat("italic"))
                        formattingArray.push("italic");
                    if (selection.hasFormat("underline"))
                        formattingArray.push("underline");
                    if (selection.hasFormat("strikethrough"))
                        formattingArray.push("strikethrough");
                    if (selection.hasFormat("code"))
                        formattingArray.push("code");

                    SetFormattingState(formattingArray);
                });
            },
        );

        return unregisterListener;
    }, []);

    // Prevent toolbar from displaying unless selection has remained unchanged for 500ms
    useEffect(() => {
        if (Position) {
            const timeout = setTimeout(() => {
                SetDisplay(true);
            }, 500);

            return () => {
                clearTimeout(timeout);
            };
        } else {
            SetDisplay(false);
        }

        return () => {};
    }, [Position]);

    return (
        <div
            className={cn(
                "pointer-events-none fixed z-50 origin-bottom -translate-x-1/2 scale-0 rounded border border-border bg-popover p-1 opacity-0 transition-transform duration-100",
                Position != null &&
                    Display &&
                    "pointer-events-auto scale-100 opacity-100",
            )}
            style={{ top: Position?.top ?? 0, left: Position?.left ?? 0 }}
        >
            <ToggleGroup
                type="multiple"
                value={FormattingState}
                onValueChange={HandleToolbarValueChange}
            >
                <ToggleGroupItem value="bold">
                    <Icon icon={LuBold} />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                    <Icon icon={LuItalic} />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline">
                    <Icon icon={LuUnderline} />
                </ToggleGroupItem>
                <ToggleGroupItem value="strikethrough">
                    <Icon icon={LuStrikethrough} />
                </ToggleGroupItem>
                <ToggleGroupItem value="code">
                    <Icon icon={LuCode} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default FloatingToolbarPlugin;
