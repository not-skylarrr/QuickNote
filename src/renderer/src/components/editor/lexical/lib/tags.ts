const GetTagsFromNode = (node: Record<string, any>): string[] => {
    if (!node.children) return [];

    let tags: string[] = [];

    for (let child of node.children) {
        if (child.type == "hashtag") {
            tags.push(child.text);
        }

        if (child.children) {
            tags.push(...GetTagsFromNode(child));
        }
    }

    return tags;
};

const GetTagsFromNoteContent = (state: Record<string, any>) => {
    const tags = GetTagsFromNode(state.root);
    return tags;
};

export { GetTagsFromNoteContent };
