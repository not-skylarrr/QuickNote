import { Location } from "react-router-dom";

export const GetNoteNavigationString = (
    noteID: string,
    quickNavigation: boolean = false,
) => {
    const params = new URLSearchParams({
        openedNotes: JSON.stringify([noteID]),
        fromQuickNav: JSON.stringify(quickNavigation),
    });
    return `/editor?${params.toString()}`;
};

export const IsFromQuickNavOrigin = (location: Location<any>) => {
    const searchParams = new URLSearchParams(location.search);
    const isQuickNavigation = searchParams.get("fromQuickNav");

    if (!isQuickNavigation) return false;

    const parsedValue = JSON.parse(isQuickNavigation);
    if (typeof parsedValue != "boolean") return false;

    return parsedValue;
};
