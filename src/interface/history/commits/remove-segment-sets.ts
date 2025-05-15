import type { Commit } from "..";
import type { LineSegmentSet } from "../../elements";
import { elementsStore } from "../../elements";
import { SerializeableName, type Deserializer, type SerOutput } from "../../serializers";
import { getDeserializer } from "../../serializers/deserializers";
export class RemoveSegmentSetsCommit implements Commit {
    constructor(
        private segmentSets: LineSegmentSet[],
    ) {
        }
    serialize(): SerOutput {
        return {
            name: SerializeableName.RemoveSegmentSetsCommit,
            data: { segmentSets: this.segmentSets.map(segmentSet => segmentSet.serialize()) },
        };
    }

    apply() {
        this.segmentSets.forEach(segmentSet => {
            elementsStore.removeLineSegmentSet(segmentSet);
        });
    }

    revert() {
        this.segmentSets.forEach(segmentSet => {
            elementsStore.addLineSegmentSet(segmentSet);
        });
    }
}

export class RemoveSegmentSetsCommitDeserializer implements Deserializer<RemoveSegmentSetsCommit> {
    deserialize(obj: SerOutput): RemoveSegmentSetsCommit {
        const segmentSetDeserializer = getDeserializer(SerializeableName.LineSegmentSet);
        const segmentSets = (obj.data.segmentSets as SerOutput[]).map(segmentSet => segmentSetDeserializer.deserialize(segmentSet) as LineSegmentSet);
        return new RemoveSegmentSetsCommit(segmentSets);
    }
}