import { HistoryNode } from ".";
import type { Commit } from ".";
import type { SerializeableName, Deserializer, SerOutput } from "../serializers";
import { getDeserializer } from "../serializers/deserializers";
export class HistoryNodeDeserializer implements Deserializer<HistoryNode<Commit>> {
    constructor() {
    }
    deserialize(obj: SerOutput): HistoryNode<Commit> {
        const stateDeserializer = getDeserializer((obj.data.state as SerOutput).name as SerializeableName);
        const state = stateDeserializer.deserialize(obj.data.state as SerOutput) as Commit;
        const children = (obj.data.children as SerOutput[]).map(child => {
            const childDeserializer = getDeserializer(child.name as SerializeableName);
            const newChild = childDeserializer.deserialize(child) as HistoryNode<Commit>;
            return newChild;
        });

        const node = new HistoryNode(state, null);
        children.forEach(child => {
            child.parent = node;
        });
        node.children = children;
        return node;
    }
}