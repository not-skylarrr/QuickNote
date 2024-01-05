import { DecoratorNode, LexicalNode, NodeKey } from "lexical";
import { ReactNode } from "react";

class ImageNode extends DecoratorNode<ReactNode> {
    __image_data: string;

    static getType() {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__image_data);
    }

    constructor(imageData: string, key?: NodeKey) {
        super(key);
        this.__image_data = imageData;
    }

    createDOM(): HTMLElement {
        return document.createElement("div");
    }

    updateDOM(): boolean {
        return false;
    }

    decorate(): ReactNode {
        return <span>Testing</span>;
    }
}

const $createImageNode = (imageData: string) => {
    return new ImageNode(imageData);
};

const $isImageNode = (node: LexicalNode | null | undefined): node is ImageNode => {
    return node instanceof ImageNode;
};

export default ImageNode;
export { $createImageNode, $isImageNode };
