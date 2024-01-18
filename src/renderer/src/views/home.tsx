export default function HomeView() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-[360px] flex-col gap-2 p-4 pt-24">
                <AnnotatedShortcut
                    shortcut="CTRL + N"
                    label="Create New Note"
                />
                <AnnotatedShortcut shortcut="CTRL + K" label="Search Notes" />
            </div>
        </div>
    );
}

type AnnotateShortcutProps = {
    label: string;
    shortcut: string;
};

const AnnotatedShortcut = ({ label, shortcut }: AnnotateShortcutProps) => {
    return (
        <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <kbd className="justify-self-end rounded border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                {shortcut}
            </kbd>
        </div>
    );
};
