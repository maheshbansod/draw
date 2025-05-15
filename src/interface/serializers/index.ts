import type { SerializeableOutput } from "../../utils/serialize";

export type SerOutput = SerializeableOutput<SerializeableName>;

export enum SerializeableName {
    MoveCommit = 'MoveCommit',
    LineSegmentSet = 'LineSegmentSet',
    HistoryNode = 'HistoryNode',
    AddSegmentSetCommit = 'AddSegmentSetCommit',
    RemoveSegmentSetsCommit = 'RemoveSegmentSetsCommit',
}

export interface Deserializer<T> {
    deserialize(obj: SerOutput): T;
}