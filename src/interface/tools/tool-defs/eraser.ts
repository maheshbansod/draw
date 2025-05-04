// todo: change this eraser to be component based eraser - so it should erase a whole component instead
// of just drawing a new line

import { canvasState } from "../../../canvas/state";
import { canvasHistory } from "../../../composables/history";
import { drawLine, drawLines } from "../../../utils/canvas";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";
export class EraserTool implements Tool {
    previousStrokeStyle: string | CanvasGradient | CanvasPattern;
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D,
        private bgColor: string,
        private lineWidth: number,
    ) {
        this.previousStrokeStyle = this.ctx.strokeStyle;
        this.ctx.strokeStyle = this.bgColor;
        let fragments: { start: { x: number, y: number }, end: { x: number, y: number } }[] = [];
        mouseSpy.registerMouseMove(this, ({isMouseDown, x, y, previousX, previousY}) => {
            if (!isMouseDown) return;
            this.eraseLine({ x: previousX, y: previousY }, { x, y });
            fragments.push({ start: { x: previousX, y: previousY }, end: { x, y } });
        });
        mouseSpy.registerMouseUp(this, () => {
            const lines = [...fragments];
            fragments = [];
            const bgColor = this.bgColor;
            const lineWidth = this.lineWidth;

            canvasHistory.push({
                apply: () => {
                    this.ctx.save();

                    this.ctx.strokeStyle = bgColor;
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.beginPath();
                    drawLines(this.ctx, lines);
                    this.ctx.stroke();

                    this.ctx.restore();
                }
            });
        });
    }
    eraseLine(start: { x: number, y: number }, end: { x: number, y: number }) {
        this.ctx.beginPath();
        drawLine(this.ctx, start, end);
        this.ctx.stroke();
    }
    onDestroy(): void {
        this.mouseSpy.unregisterAll(this);
        this.ctx.strokeStyle = this.previousStrokeStyle;
    }
}

export class EraserToolActivator extends ToolActivator {
    name = 'Eraser';
    icon = 'eraser';
    for = EraserTool;
    constructor(deps: ToolDependencies) {
        super(deps);
    }
    activate(): Tool {
        const bgColor = canvasState.bgColor;
        const lineWidth = canvasState.lineWidth;
        return new EraserTool(this.deps.mouseSpy, this.deps.ctx, bgColor, lineWidth);
    }
}