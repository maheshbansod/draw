export class HistoryNode<T> {
    children: HistoryNode<T>[];
    parent: HistoryNode<T> | null;
    state: T;

    constructor(state: T, parent: HistoryNode<T> | null) {
        this.children = [];
        this.parent = parent;
        this.state = state;
    }
}