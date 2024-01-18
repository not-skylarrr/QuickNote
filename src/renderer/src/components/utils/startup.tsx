import { GetNoteNavigationString } from "@renderer/lib/navigation";
import { useConfig } from "@renderer/providers/ipc/config-provider";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const StartupManager = () => {
    const navigate = useNavigate();
    const { config } = useConfig();
    const { notes } = useNotes();

    const [RedirectOccurred, SetRedirectOccurred] = useState(false);

    const NavigateToRecent = () => {
        const recentNoteID = window.localStorage.getItem("recent-note");
        if (!recentNoteID) return;

        const note = notes.find((n) => n.id == recentNoteID);
        if (!note) return;

        navigate(GetNoteNavigationString(recentNoteID));
        SetRedirectOccurred(true);
    };

    useEffect(() => {
        if (RedirectOccurred) return;
        if (!config || !notes) return;

        if (config["editor.openOnStartup"] == "recent") {
            NavigateToRecent();
            return;
        }

        let timeout = setTimeout(() => {
            SetRedirectOccurred(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [RedirectOccurred, config, notes]);

    return null;
};
