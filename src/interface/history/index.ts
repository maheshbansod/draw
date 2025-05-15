import { elementsStore } from "../elements";
import type { Serializeable } from "../../utils/serialize";
import { SerializeableName, type SerOutput } from "../serializers";
import { getDeserializer } from "../serializers/deserializers";
/**
 * Possible improvements:
 * - store snapshot on some intermediate steps maybe? -> can help with multiple undos
 * - use web worker
 */
type SerializedHistoryNode = {
    state: SerOutput,
    isHead?: boolean,
    children: SerializedHistoryNode[],
} | null;

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
        let current: HistoryNode<Commit> | null = this.root;
        const serializeCurrent = (current: HistoryNode<Commit>): SerializedHistoryNode => {
            const currentStateSerialized = current.state.serialize();
            const currentChildrenSerialized = current.children.map(child => {
                return serializeCurrent(child);
            });
            return {
                state: currentStateSerialized,
                children: currentChildrenSerialized,
                isHead: current === this.head ? true : undefined,
            };
        }
        const serialized = current ? serializeCurrent(current) : null;
        localStorage.setItem('history', JSON.stringify(serialized));
    }

    loadHistory() {
        const serialized = localStorage.getItem('history');
        if (serialized) {
            const serializedHistory: SerializedHistoryNode = JSON.parse(serialized);
            const deserializeCurrent = (serialized: SerializedHistoryNode): HistoryNode<Commit>|null => {
                if (!serialized) {
                    return null;
                }
                const deserializer = getDeserializer(serialized.state.name);
                const current = deserializer.deserialize(serialized.state) as Commit;
                const children = serialized.children.map(child => deserializeCurrent(child)!).filter(Boolean);
                const node = new HistoryNode(current, null);
                node.children = children;
                node.children.forEach(child => {
                    child.parent = node;
                });
                if (serialized.isHead) {
                    this.head = node;
                }
                return node;
            }
            const root = deserializeCurrent(serializedHistory);
            this.root = root;
            if (!this.root) {
                this.head = null;
            }

            this.applyAll();
        }
    }

    clear() {
        this.head = null;
        this.root = null;
        this.saveHistory();
        elementsStore.clear();
        elementsStore.resetCanvas();
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
        const toApply = [];

        let current: HistoryNode<Commit> | null = this.head;
        while (current) {
            toApply.push(current);
            current = current.parent;
        }

        elementsStore.resetCanvas();
        toApply.forEach(node => {
            node.state.apply();
        });
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
