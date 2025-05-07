import { canvasState } from "../canvas/state";
import { drawLine, drawLines } from "../utils/canvas";
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        drawLines(ctx, this.segments);
        if (this.loop) {
            const lastSegment = this.segments[this.segments.length - 1];
            const firstSegment = this.segments[0];
            drawLine(ctx, lastSegment.end, firstSegment.start);
        }
    }
}

class ElementStore {
    private lineSegmentSets: LineSegmentSet[] = [];
    private ctx: CanvasRenderingContext2D | null = null;

    constructor(
    ) {
    }

    setCtx(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    resetCanvas() {
        if (!this.ctx) return;
        this.ctx.strokeStyle = canvasState.strokeStyle;
        this.ctx.lineWidth = canvasState.lineWidth;

        this.ctx.fillStyle = canvasState.bgColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.beginPath();
        this.lineSegmentSets.forEach((segment) => {
            segment.draw(this.ctx!);
        });
        this.ctx.stroke();
    }

    selectLineSegmentAt(x: number, y: number) {
        for (const segment of this.lineSegmentSets) {
            if (segment.containsPoint(x, y)) {
                return segment;
            }
        }
    }

    removeLineSegmentSet(segment: LineSegmentSet) {
        this.lineSegmentSets.splice(this.lineSegmentSets.indexOf(segment), 1);
    }

    addLineSegmentSet(segment: LineSegmentSet) {
        this.lineSegmentSets.push(segment);
    }

    addRectangle(
        x: number, y: number, width: number, height: number,
        strokeStyle: string = 'black',
        lineWidth: number = 1,
    ) {
        const segmentSet = new LineSegmentSet([
            {start: {x, y}, end: {x: x + width, y}},
            {start: {x: x + width, y}, end: {x: x + width, y: y + height}},
            {start: {x: x + width, y: y + height}, end: {x, y: y + height}},
        ], strokeStyle, lineWidth, true);
        this.lineSegmentSets.push(segmentSet);
        return segmentSet;
    }
}
export const elementsStore = new ElementStore();
