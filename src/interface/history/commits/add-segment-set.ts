import type { Commit } from "..";
import type { SerializeableOutput } from "../../../utils/serialize";
import { elementsStore, type LineSegmentSet } from "../../elements";
import { SerializeableName, type Deserializer, type SerOutput } from "../../serializers";   
import { getDeserializer } from "../../serializers/deserializers";
export class AddSegmentSetCommit implements Commit {
    constructor(
        private segmentSet: LineSegmentSet,
    ) {
    }
    serialize(): SerializeableOutput<SerializeableName> {
        return {
            name: SerializeableName.AddSegmentSetCommit,
            data: {
                segmentSet: this.segmentSet.serialize(),
            },
        };
    }

    apply() {
        elementsStore.addLineSegmentSet(this.segmentSet);
    }

    revert() {
        elementsStore.removeLineSegmentSet(this.segmentSet);
    }
    
    
    
}

export class SegmentSetCommitDeserializer implements Deserializer<AddSegmentSetCommit> {
    deserialize(obj: SerOutput): AddSegmentSetCommit {
        const segmentSetDeserializer = getDeserializer(SerializeableName.LineSegmentSet);
        const segmentSet = segmentSetDeserializer.deserialize(obj.data.segmentSet as SerOutput) as LineSegmentSet;
        return new AddSegmentSetCommit(segmentSet);
    }
}
