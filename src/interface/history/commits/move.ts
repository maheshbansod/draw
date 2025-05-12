import type { Commit } from "..";
import type { LineSegmentSet } from "../../elements";
import { SerializeableName, type Deserializer, type SerOutput } from "../../serializers";
import { getDeserializer } from "../../serializers/deserializers";
export class MoveCommit implements Commit {
    constructor(
        private segmentSet: LineSegmentSet,
        private translateX: number,
        private translateY: number
    ) {
    }

    apply(): void {
        this.segmentSet.translate(this.translateX, this.translateY);
    }

    revert(): void {
        this.segmentSet.translate(-this.translateX, -this.translateY);
    }

    serialize(): SerOutput {
        return {
            name: SerializeableName.MoveCommit,
            data: {
                segmentSet: this.segmentSet.serialize(),
                translateX: this.translateX,
                translateY: this.translateY
            }
        }
    }
}

export class MoveCommitDeserializer implements Deserializer<MoveCommit> {
    deserialize(obj: SerOutput): MoveCommit {
        const translateX = obj.data.translateX;
        if (typeof translateX !== 'number') {
            throw new Error('translateX is not a number');
        }
        const translateY = obj.data.translateY;
        if (typeof translateY !== 'number') {
            throw new Error('translateY is not a number');
        }
        const segmentSetDeserializer = getDeserializer(SerializeableName.LineSegmentSet);
        if (typeof obj.data.segmentSet !== 'object' || obj.data.segmentSet === null
            || !('name' in obj.data.segmentSet)
            || obj.data.segmentSet.name !== SerializeableName.LineSegmentSet
        ) {
            throw new Error('segmentSet is not an object');
        }

        const segmentSet = segmentSetDeserializer.deserialize(obj.data.segmentSet as SerOutput) as LineSegmentSet;
        return new MoveCommit(segmentSet, translateX, translateY);
    }
}