import { Button } from "@renderer/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import Icon from "@renderer/components/ui/icon";
import { useNotes } from "@renderer/providers/notes-provider";
import { LuFilePlus, LuFolderPlus, LuPlus, LuSettings } from "react-icons/lu";
import { Link } from "react-router-dom";

const SidebarFooter = () => {
    const { createNote } = useNotes();

    return (
        <div className="mt-auto flex w-[300px] flex-row items-center justify-between border-t border-t-border p-2">
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
                    <DropdownMenuItem onSelect={() => createNote("New Note")}>
                        <Icon icon={LuFilePlus} /> New Note
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Icon icon={LuFolderPlus} /> New Folder
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default SidebarFooter;
