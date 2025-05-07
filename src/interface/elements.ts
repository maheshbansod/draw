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
        public readonly strokeStyle: string = 'black',
        public readonly lineWidth: number = 1,
        public readonly loop: boolean = false,
    ) {
    }

    containsPoint(x: number, y: number) {
        for (const segment of this.segments) {
            if (isPointOnLine(x, y, segment.start, segment.end, this.lineWidth)) {
                return true;
            }
        }
    }

    translate(dx: number, dy: number) {
        for (const segment of this.segments) {
            segment.start.x += dx;
            segment.start.y += dy;
            segment.end.x += dx;
            segment.end.y += dy;
        }
    }

    firstPoint() {
        return {...this.segments[0].start};
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

    getSegments() {
        return this.segments.map(segment => ({...segment}));
    }
}

class ElementStore {
    private lineSegmentSets: LineSegmentSet[] = [];
    private ctx: CanvasRenderingContext2D | null = null;
    private selectedLineSegmentSet: LineSegmentSet | null = null;
    constructor(
    ) {
    }

    setCtx(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    resetCanvas() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = canvasState.strokeStyle;
        ctx.lineWidth = canvasState.lineWidth;

        ctx.fillStyle = canvasState.bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.lineSegmentSets.forEach((segment) => {
            ctx.beginPath();
            segment.draw(ctx);
            ctx.stroke();
        });
        ctx.beginPath();
        if (this.selectedLineSegmentSet) {
            this.drawSelectedLineSegmentSetOutline();
        }
        ctx.stroke();
        ctx.restore();
    }

    drawSelectedLineSegmentSetOutline() {
        if (!this.selectedLineSegmentSet) return;
        if (!this.ctx) return;

        // for now let's say i show selection only as a single pixel segment set

        const outlineSegmentSet = new LineSegmentSet(this.selectedLineSegmentSet.getSegments(), 'cyan', 1, this.selectedLineSegmentSet.loop);
        outlineSegmentSet.draw(this.ctx);
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

    setSelectedLineSegmentSet(segmentSet: LineSegmentSet|null) {
        this.selectedLineSegmentSet = segmentSet;
    }

    getSelectedLineSegmentSet() {
        return this.selectedLineSegmentSet;
    }
}
export const elementsStore = new ElementStore();
