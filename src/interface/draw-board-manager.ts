import { elementsStore } from './elements';
import { HistoryNode } from './history';

/**
 * Possible improvements:
 * - store snapshot on some intermediate steps maybe? -> can help with multiple undos
 * - use web worker
 */
export class CanvasHistoryManager {
    head: HistoryNode<Commit> | null;

    constructor() {
        this.head = null;
    }

    push(commit: Commit) {
        const node = new HistoryNode<Commit>(commit, this.head);
        if (this.head === null) {
            this.head = node;
        } else {
            this.head.children.push(node);
        }
        this.head = node;
    }

    undo() {
        if (this.head === null) {
            return;
        }
        this.head.state.revert();
        elementsStore.resetCanvas();
        this.head = this.head.parent;
    }
    
}

export interface Commit {
    apply(): void;
    revert(): void;
}