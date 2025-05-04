import { isPointOnLine } from "../utils/math";

export type LineSegment = {
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    };
}

export class LineSegmentSet {
    constructor(
        private segments: LineSegment[] = [],
        /**
         * If true, the last segment will be connected to the first segment
         */
        private strokeStyle: string = 'black',
        private lineWidth: number = 1,
        private loop: boolean = false,
    ) {
    }

    containsPoint(x: number, y: number) {
        for (const segment of this.segments) {
            if (isPointOnLine(x, y, segment.start, segment.end, this.lineWidth)) {
                return true;
            }
        }
    }
}

export const elementsStore = {
    lineSegmentSets: [] as LineSegmentSet[],
    selectLineSegmentAt: (x: number, y: number) => {
        for (const segment of elementsStore.lineSegmentSets) {
            if (segment.containsPoint(x, y)) {
                return segment;
            }
        }
    }
};