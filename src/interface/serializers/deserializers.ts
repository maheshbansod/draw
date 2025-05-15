import { SerializeableName, type Deserializer } from ".";
import { LineSegmentSetDeserializer } from "../elements";
import { MoveCommitDeserializer } from "../history/commits/move";
import { SegmentSetCommitDeserializer } from "../history/commits/add-segment-set";
import { RemoveSegmentSetsCommitDeserializer } from "../history/commits/remove-segment-sets";
import { HistoryNodeDeserializer } from "../history/history-node-deserializer";
export const Deserializers = {
    [SerializeableName.MoveCommit]: MoveCommitDeserializer,
    [SerializeableName.LineSegmentSet]: LineSegmentSetDeserializer,
    [SerializeableName.HistoryNode]: HistoryNodeDeserializer,
    [SerializeableName.AddSegmentSetCommit]: SegmentSetCommitDeserializer,
    [SerializeableName.RemoveSegmentSetsCommit]: RemoveSegmentSetsCommitDeserializer,
} as const satisfies Record<SerializeableName, new (...args: any[]) => Deserializer<any>>;

export function getDeserializer(name: SerializeableName) {
    return new Deserializers[name]();
}