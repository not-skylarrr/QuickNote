import { useEffect, useState } from "react";
import { LuFilePlus, LuFolderPlus } from "react-icons/lu";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { Dialog, DialogContent } from "./ui/dialog";
import Icon from "./ui/icon";

const ApplicationSearch = () => {
    const [Open, SetOpen] = useState(false);

    const HandleDocumentKeyDown = (ev: KeyboardEvent) => {
        if (ev.ctrlKey && ev.key == "k") {
            SetOpen((curr) => !curr);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", HandleDocumentKeyDown);

        return () => {
            document.removeEventListener("keydown", HandleDocumentKeyDown);
        };
    }, []);

    return (
        <Dialog open={Open} onOpenChange={SetOpen}>
            <DialogContent className="w-[500px] max-w-none p-0">
                <Command>
                    <CommandInput placeholder="Search Application" />
                    <CommandList>
                        <CommandGroup heading="Quick Actions">
                            <CommandItem value="New Note">
                                <Icon icon={LuFilePlus} className="mr-2" /> New
                                Note
                            </CommandItem>
                            <CommandItem value="New Folder">
                                <Icon icon={LuFolderPlus} className="mr-2" />{" "}
                                New Folder
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationSearch;
