export const ObjectMerge = <T extends object>(parent: T, update: object) => {
    const ParentKeys = Object.keys(parent);
    const UpdateKeys = Object.keys(update);

    for (let parentKey of ParentKeys) {
        if (UpdateKeys.includes(parentKey)) {
            if (typeof UpdateKeys[parentKey] == "object") {
                parentKey[parentKey] = ObjectMerge(
                    parentKey[parentKey],
                    update[parentKey],
                );
            } else {
                parent[parentKey] = update[parentKey];
            }

            UpdateKeys.splice(UpdateKeys.indexOf(parentKey), 1);
        }
    }

    if (UpdateKeys.length > 0) {
        for (let key of UpdateKeys) {
            parent[key] = update[key];
        }
    }

    return parent;
};
