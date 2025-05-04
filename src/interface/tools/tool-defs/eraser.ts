import { canvasState } from "../../../canvas/state";
import { drawLine } from "../../../utils/canvas";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";
export class EraserTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D,
        private bgColor: string,
        private lineWidth: number,
    ) {
        mouseSpy.registerMouseMove(this, ({isMouseDown, x, y, previousX, previousY}) => {
            if (!isMouseDown) return;
            this.eraseLine({ x: previousX, y: previousY }, { x, y });
        });
    }
    eraseLine(start: { x: number, y: number }, end: { x: number, y: number }) {
        const previousStrokeStyle = this.ctx.strokeStyle;
        this.ctx.strokeStyle = this.bgColor;
        drawLine(this.ctx, start, end);
        this.ctx.strokeStyle = previousStrokeStyle;
    }
    onDestroy(): void {
        this.mouseSpy.unregisterAll(this);
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