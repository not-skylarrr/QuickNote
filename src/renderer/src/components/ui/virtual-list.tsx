import { useState } from "react";

type VirtualListProps = {
    listHeight: number;
    rowHeight: number;
    rows: React.ReactNode[][];
    colCount: number;
    overlapCount?: number;
};

const VirtualList = ({
    listHeight,
    rowHeight,
    rows,
    colCount,
    overlapCount = 2,
}: VirtualListProps) => {
    const [Scroll, SetScroll] = useState(0);

    const HandleScroll = (ev: React.UIEvent<HTMLDivElement>) => {
        SetScroll(ev.currentTarget.scrollTop);
    };

    const GridSizingString = [...new Array(colCount)]
        .map(() => "1fr")
        .join(" ");

    return (
        <div
            className="w-full overflow-y-auto overflow-x-hidden"
            style={{ height: `${listHeight}px` }}
            onScroll={HandleScroll}
        >
            <div
                data-vlistcontainer
                className="relative w-full"
                style={{ height: `${rowHeight * rows.length}px` }}
            >
                {rows.map((elem, index) => {
                    const pixelPosition = rowHeight * index;

                    const renderedPositionTop =
                        Math.floor(Scroll / rowHeight) * rowHeight -
                        rowHeight * overlapCount;
                    const renderedPositionBottom =
                        Math.floor(Scroll / rowHeight) * rowHeight +
                        listHeight +
                        rowHeight * overlapCount;

                    if (pixelPosition < renderedPositionTop) return null;
                    if (pixelPosition > renderedPositionBottom) return null;

                    return (
                        <div
                            key={`vlist-row-${index}`}
                            style={{
                                width: "100%",
                                position: "absolute",
                                top: `${pixelPosition}px`,
                                display: "grid",
                                gridTemplateColumns: GridSizingString,
                            }}
                        >
                            {elem}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const GroupByCount = (arr: any[], colCount: number) => {
    const groups: any[] = [];

    for (const item of arr) {
        if (groups.length == 0) {
            groups.push([item]);
        } else if (groups.at(-1).length < colCount) {
            groups.at(-1).push(item);
        } else {
            groups.push([item]);
        }
    }

    return groups;
};

export default VirtualList;
export { GroupByCount };
