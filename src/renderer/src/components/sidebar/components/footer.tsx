import { Button } from "@renderer/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import Icon from "@renderer/components/ui/icon";
import { GetNoteNavigationString } from "@renderer/lib/navigation";
import { useFolders } from "@renderer/providers/ipc/folder-provider";
import { useNotes } from "@renderer/providers/ipc/notes-provider";
import { LuFilePlus, LuFolderPlus, LuPlus, LuSettings } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useSidebarTabs } from "./tabs";

const SidebarFooter = () => {
    const navigate = useNavigate();
    const { createNote } = useNotes();
    const { createFolder } = useFolders();
    const { tabID } = useSidebarTabs();

    const HandleNoteCreate = async () => {
        const note = await createNote("New Note", { parentFolder: tabID });
        navigate(GetNoteNavigationString(note.id));
    };

    const HandleFolderCreate = async () => {
        await createFolder("New Folder", {
            parentFolder: tabID == "root" ? null : tabID,
        });
    };

    return (
        <div className="mt-auto flex w-[300px] shrink-0 flex-row items-center justify-between border-t border-t-border p-2">
            <Button
                className="shrink-0 text-muted-foreground hover:text-foreground"
                variant="ghost"
                size="icon"
                asChild
            >
                <Link to="/settings">
                    <Icon icon={LuSettings} dimensions={20} />
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="shrink-0 text-muted-foreground hover:text-foreground group-data-[collapsed=true]/sidebar:hidden"
                        variant="ghost"
                        size="icon"
                    >
                        <Icon icon={LuPlus} dimensions={20} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mb-2 w-[180px]">
                    <DropdownMenuItem onSelect={HandleNoteCreate}>
                        <Icon icon={LuFilePlus} /> New Note
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={HandleFolderCreate}>
                        <Icon icon={LuFolderPlus} /> New Folder
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default SidebarFooter;
