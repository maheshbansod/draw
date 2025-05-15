import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";
import { drawLine } from "../../../utils/canvas";
import { canvasState } from "../../../canvas/state";
import { canvasHistory } from "../../../composables/history";
import { LineSegmentSet } from "../../elements";
import { elementsStore } from "../../elements";
import { AddSegmentSetCommit } from "../../history/commits/add-segment-set";
export class PenTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D,
        private strokeStyle: string,
        private lineWidth: number,
    ) {
        let fragments: {
            start: { x: number, y: number },
            end: { x: number, y: number },
            strokeStyle: string,
            lineWidth: number
        }[] = [];
        mouseSpy.registerMouseDown(this, () => {
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
        });
        mouseSpy.registerMouseMove(this, ({isMouseDown, x, y, previousX, previousY}) => {
            if (!isMouseDown) return;

            this.scheduleDrawLine({ x: previousX, y: previousY }, { x, y });

            fragments.push({
                start: { x: previousX, y: previousY },
                end: { x, y },
                strokeStyle: this.strokeStyle,
                lineWidth: this.lineWidth
            });
        });
        mouseSpy.registerMouseUp(this, () => {
            const lines = [...fragments];
            fragments = [];
            const strokeStyle = this.strokeStyle;
            const lineWidth = this.lineWidth;

            const lineSegmentSet = new LineSegmentSet(lines, strokeStyle, lineWidth);
            elementsStore.addLineSegmentSet(lineSegmentSet);
            elementsStore.resetCanvas();

            canvasHistory.push(new AddSegmentSetCommit(lineSegmentSet));
        });
    }
    scheduleDrawLine(start: { x: number, y: number }, end: { x: number, y: number }) {
        // todo: maybe i'll queue  them and draw later with debouncing idk

        this.ctx.beginPath();
        this.drawLine(start, end);
        this.ctx.stroke();
    }

    drawLine(start: { x: number, y: number }, end: { x: number, y: number }) {
        // what if i assume that stroke style and line width are already set?
        // i think this makes sense, since i have a watcher on the canvas state
        // so i don't need to set them here.
        // so let's do this. let's only set them for things like eraser where it's not equal to stroke style
        // this.ctx.strokeStyle = this.strokeStyle;
        // this.ctx.lineWidth = this.lineWidth;
        drawLine(this.ctx, start, end);
    }

    onDestroy() {
        this.mouseSpy.unregisterAll(this);
    }
}

export class PenToolActivator extends ToolActivator {
    name = 'Pen';
    icon = 'pen';
    for = PenTool;

    constructor(deps: ToolDependencies) {
        super(deps);
    }
    activate() {
        const strokeStyle = canvasState.strokeStyle;
        const lineWidth = canvasState.lineWidth;
        return new PenTool(this.deps.mouseSpy, this.deps.ctx, strokeStyle, lineWidth);
    }
}

