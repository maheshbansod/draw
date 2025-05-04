import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";

export class PenTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D,
    ) {
        mouseSpy.registerMouseMove(this, ({isMouseDown, x, y, previousX, previousY}) => {
            if (!isMouseDown) return;

            this.drawLine({ x: previousX, y: previousY }, { x, y });
        });
    }

    drawLine(start: { x: number, y: number }, end: { x: number, y: number }) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    onDestroy() {
        this.mouseSpy.unregisterAll(this);
    }

    static getActivator() {
        return (mouseSpy: MouseSpy, ctx: CanvasRenderingContext2D) => {
            return new PenTool(mouseSpy, ctx);
        }
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
        return new PenTool(this.deps.mouseSpy, this.deps.ctx);
    }
}

