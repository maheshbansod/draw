import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";
import { drawLine } from "../../../utils/canvas";
import { canvasState } from "../../../canvas/state";

export class PenTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D,
        private strokeStyle: string,
        private lineWidth: number,
    ) {
        mouseSpy.registerMouseMove(this, ({isMouseDown, x, y, previousX, previousY}) => {
            if (!isMouseDown) return;

            this.drawLine({ x: previousX, y: previousY }, { x, y });
        });
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

