import { elementsStore } from "../elements";
import type { Serializeable } from "../../utils/serialize";
import { SerializeableName, type SerOutput } from "../serializers";
import { getDeserializer } from "../serializers/deserializers";
import type { HistoryNodeDeserializer } from "./history-node-deserializer";
/**
 * Possible improvements:
 * - store snapshot on some intermediate steps maybe? -> can help with multiple undos
 * - use web worker
 */
export class CanvasHistoryManager {
    head: HistoryNode<Commit> | null;
    root: HistoryNode<Commit> | null;

    constructor() {
        this.head = null;
        this.root = null;
    }

    push(commit: Commit) {
        const node = new HistoryNode<Commit>(commit, this.head);
        if (this.head === null) {
            this.head = node;
            this.root = node;
        } else {
            this.head.children.push(node);
        }
        this.head = node;
        setTimeout(() => {
            // todo : debounce it
            this.saveHistory();
        })
    }

    saveHistory() {
        const serialized = this.root?.serialize();
        if (serialized) {
            localStorage.setItem('history', JSON.stringify(serialized));
        }
    }

    loadHistory() {
        const serialized = localStorage.getItem('history');
        if (serialized) {
            const deserializer = getDeserializer(SerializeableName.HistoryNode);
            this.root = deserializer.deserialize(JSON.parse(serialized)) as HistoryNode<Commit>;

            this.applyAll();
        }
    }

    undo() {
        if (this.head === null) {
            return;
        }
        this.head.state.revert();
        elementsStore.resetCanvas();
        this.head = this.head.parent;

        setTimeout(() => {
            // todo : debounce it
            this.saveHistory();
        })
    }

    applyAll() {
        if (this.root === null) {
            return;
        }
        elementsStore.resetCanvas();

        let current: HistoryNode<Commit> | null = this.root;
        let lastApplied: HistoryNode<Commit> | null = null;
        while (current) {
            current.state.apply();
            lastApplied = current;

            if (current.children.length > 0) {
                current = current.children[current.children.length - 1];
            } else {
                current = null;
            }
        }
        this.head = lastApplied;
    }
    
}

export interface Commit extends Serializeable<SerializeableName> {
    apply(): void;
    revert(): void;
}

export class HistoryNode<T extends Serializeable<SerializeableName>> implements Serializeable<SerializeableName> {
    children: HistoryNode<T>[];
    parent: HistoryNode<T> | null;
    state: T;

    constructor(state: T, parent: HistoryNode<T> | null) {
        this.children = [];
        this.parent = parent;
        this.state = state;
    }

    serialize(): SerOutput {
        const children = this.children.map(child => child.serialize());
        return {
            name: SerializeableName.HistoryNode,
            data: {
                state: this.state.serialize(),
                children,
            }
        }
    }
}
