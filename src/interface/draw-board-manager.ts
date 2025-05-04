import { HistoryNode } from './history';

/**
 * Possible improvements:
 * - store snapshot on some intermediate steps maybe? -> can help with multiple undos
 * - use web worker
 */
export class CanvasHistoryManager {
    head: HistoryNode<Commit> | null;
    
    // make sure you set these before using the manager
    private beforeFirstCommit!: () => void
    private ctx!: CanvasRenderingContext2D;

    constructor() {
        this.head = null;
    }

    setBeforeFirstCommit(beforeFirstCommit: () => void) {
        this.beforeFirstCommit = beforeFirstCommit;
    }

    setCtx(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
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

        // first let's pop the head
        const oldHead = this.head;
        this.head = this.head.parent;
        this.head?.children.splice(this.head?.children.indexOf(oldHead), 1);

        // i will do all commits from start to head
        let start = this.head;
        const commits = [];
        while (start) {
            commits.push(start);
            start = start.parent;
        }
        // start is now the first commit
        // i will do all commits from start to head
        this.ctx.save();
        this.beforeFirstCommit();
        while (commits.length > 0) {
            const commit = commits.pop();
            if (commit) {
                commit.state.apply();
            }
        }
        this.ctx.restore();
    }
    
}

export interface Commit {
    apply(): void;
}