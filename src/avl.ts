interface Node<Key, Value> {
    item: Item<Key, Value>;
    parentNode?: Node<Key, Value>;
    leftChild?: Node<Key, Value>;
    rightChild?: Node<Key, Value>;
    height: number;
}

interface Item<Key, Value> {
    readonly key: Key;
    data: Value;
}

enum Rotation {
    NO_ROTATION = 0,
    LEFT_ROTATION = 1,
    RIGHT_ROTATION = 2,
    LEFT_RIGHT_ROTATION = 3,
    RIGHT_LEFT_ROTATION = 4
}

type Predicate<Key> = (currKey: Key, newKey: Key) => number;

class Node<Key, Value> implements Node<Key, Value> {
    constructor(public item: Item<Key, Value>, public height: number, public parentNode?: Node<Key, Value>, public leftChild?: Node<Key, Value>, public rightChild?: Node<Key, Value>) { }
}

function isEmpty(key: any) {
    return key === null || key === undefined;
}

abstract class TreeContainer<Key, Value> {
    protected _length = 0;
    protected node: Node<Key, Value> | undefined;
    constructor() { }
    // public pop();
}

/**
 * @description AVL tree gives
 * o(log n) insertion
 * o(log n) deletion
 * you can order your elements with respect key
 */
export class AVL<Key, Value> {
    private node?: Node<Key, Value>;
    private _length = 0;
    constructor(...items: Item<Key, Value>[], private predicate?: Predicate<Key>) {
        this.push(...items);
    }

    push(...data: any[]) {
        const val = data[0];
        if (!this.predicate) {
            if (typeof val === "string") {
                this.predicate = (currKey, newKey) => (currKey as unknown as string).localeCompare(newKey as unknown as string);
            } else if (typeof val === "number") {
                this.predicate = (currKey, newKey) => ((currKey as unknown as number) - (newKey as unknown as number));
            } else (typeof val === "object") {
                throw new Error("please provide predicate function for object type");
            }
        }
        data.forEach((val) => {
            if (isEmpty(data) || val === NaN) {
                throw new Error(`Data cannot be ${val}`);
            }
            this.insert(val, this.node);
            this._length++;
        });
    }

    get length() {
        return this._length;
    }

    public pop(...keys: Key[]) {
        keys.forEach(key => {
            if (length === 0) {
                throw new Error("Cannot pop item from empty tree");
            } else {
                this.remove(key, this.node!);
            }
        });
    }

    private remove(key: Key, rootNode: Node<Key, Value>) {
        if (isEmpty(rootNode)) {
            return rootNode;
        } else {
            const predicate = this.predicate!(rootNode.item.key, key);
            if (predicate === 0) {

            } else if (predicate < 0) {

            } else {

            }
        }
    }

    private create(item: Item<Key, Value>, height: number) {
        return new Node(item, height);
    }

    private getNodeHeight(node?: Node<Key, Value>) {
        return (node) ? node.height : 0;
    }

    private getMaxChildrenHeight(node: Node<Key, Value>) {
        return Math.max(this.getNodeHeight(node.leftChild), this.getNodeHeight(node.rightChild));
    }

    private leftRotate(rootNode: Node<Key, Value>) {
        const newRootNode = rootNode.leftChild!;
        rootNode.leftChild = newRootNode.rightChild!;
        rootNode.leftChild.parentNode = rootNode;
        rootNode.parentNode = newRootNode;
        rootNode.height = 1 + this.getMaxChildrenHeight(rootNode);
        newRootNode.height = 1 + this.getMaxChildrenHeight(newRootNode);
        return newRootNode;
    }

    private rightRotate(rootNode: Node<Key, Value>) {
        const newRootNode = rootNode.rightChild!;
        rootNode.rightChild = newRootNode?.leftChild;
        rootNode.parentNode = newRootNode;
        rootNode!.rightChild!.parentNode = rootNode;
        rootNode.height = 1 + this.getMaxChildrenHeight(rootNode);
        newRootNode!.height = 1 + this.getMaxChildrenHeight(newRootNode!);
        return newRootNode;
    }

    private insert(item: Item<Key, Value>, rootNode?: Node<Key, Value>, parentNode?: Node<Key, Value>) {
        if (isEmpty(rootNode)) {
            const height = 1;
            return rootNode = this.create(item, height);
        } else {
            rootNode!.parentNode = parentNode;
            const predicate = this.predicate!(rootNode!.item.key, item.key);
            if (predicate === 0) {
                return rootNode;
            } else if (predicate < 0) {
                rootNode!.leftChild = this.insert(item, rootNode!.leftChild, rootNode);
            } else {
                rootNode!.rightChild = this.insert(item, rootNode!.rightChild, rootNode);
            }
            rootNode!.height++;
            const rotationType = this.getRotationType(rootNode!);
            rootNode = this.rotate(rootNode!, rotationType);
            rootNode!.parentNode = parentNode;
        }
    }

    private getRotationType(rootNode: Node<Key, Value>) {
        let rotation = Rotation.NO_ROTATION;
        const diff = this.getNodeHeight(rootNode.leftChild) - this.getNodeHeight(rootNode.rightChild);
        if (diff >= 2) {
            const leftChild = rootNode!.leftChild as Node<Key, Value>;
            const leftHeight = this.getNodeHeight(leftChild.leftChild);
            const rightHeight = this.getNodeHeight(leftChild.rightChild);
            if (leftHeight > rightHeight) {
                rotation = Rotation.LEFT_ROTATION;
            } else {
                rotation = Rotation.RIGHT_LEFT_ROTATION;
            }
        } else if (diff <= -2) {
            const rightChild = rootNode!.rightChild as Node<Key, Value>;
            const leftHeight = this.getNodeHeight(rightChild.leftChild);
            const rightHeight = this.getNodeHeight(rightChild.rightChild);
            if (leftHeight > rightHeight) {
                rotation = Rotation.LEFT_RIGHT_ROTATION;
            } else {
                rotation = Rotation.RIGHT_ROTATION;
            }
        }

        return rotation;
    }

    private rotate(rootNode: Node<Key, Value>, rotationType: Rotation) {
        switch (rotationType) {
            case Rotation.LEFT_RIGHT_ROTATION:
                rootNode.leftChild = this.leftRotate(rootNode.leftChild!);
                rootNode = this.rightRotate(rootNode);
                break;
            case Rotation.LEFT_ROTATION:
                rootNode = this.leftRotate(rootNode);
                break;
            case Rotation.RIGHT_ROTATION:
                rootNode = this.rightRotate(rootNode);
                break;
            case Rotation.RIGHT_LEFT_ROTATION:
                rootNode.rightChild = this.rightRotate(rootNode.rightChild!);
                rootNode = this.leftRotate(rootNode);
                break;
        }
        return rootNode;
    }

}