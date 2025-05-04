import type { DrawBoard } from './draw-board';
import { HistoryNode } from './history';

export class CanvasManager {
    head: HistoryNode<Commit> | null;

    constructor(drawBoard: DrawBoard) {
        this.head = null;
    }

    push(commit: Commit) {
        const node = new HistoryNode<Commit>(commit);
        commit.apply();
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

        this.head.state.rollback();
        this.head = this.head.parent;
    }
    
}

export interface Commit {
    rollback(): void;
    apply(): void;
}