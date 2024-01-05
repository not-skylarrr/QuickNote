export const DecircularizeObject = (object: object) => {
    return JSON.parse(JSON.stringify(object));
};

export const ArrayDiff = (oldArray: any[], newArray: any[]) => {
    let newItems: any[] = newArray;
    let removedItems: any[] = oldArray;

    for (let item of newItems) {
        if (oldArray.includes(item)) {
            newItems.splice(newItems.indexOf(item), 1);
        }
    }

    for (let item of removedItems) {
        if (newArray.includes(item)) {
            removedItems.splice(removedItems.indexOf(item), 1);
        }
    }

    return [newItems, removedItems] as const;
};
