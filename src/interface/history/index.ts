export class HistoryNode<T> {
    children: HistoryNode<T>[];
    parent: HistoryNode<T> | null;
    state: T;

    constructor(state: T) {
        this.children = [];
        this.parent = null;
        this.state = state;
    }
}