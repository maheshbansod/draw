import { canvasState } from "../../../canvas/state";
import { canvasHistory } from "../../../composables/history";
import { elementsStore } from "../../elements";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";
import { AddSegmentSetCommit } from "../../history/commits/add-segment-set";
export class RectangleTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D
    ) {
        let cachedCanvasData: ImageData | null = null;
        let initialMousePos: {x: number, y: number} | null = null;
        this.mouseSpy.registerMouseDown(this, ({x, y}) => {
            cachedCanvasData = this.ctx.getImageData(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
            initialMousePos = {x, y};
        });
        this.mouseSpy.registerMouseMove(this, ({x, y}) => {
            if (!initialMousePos) return;
            const dx = x - initialMousePos.x;
            const dy = y - initialMousePos.y;
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            if (cachedCanvasData) {
                this.ctx.putImageData(cachedCanvasData, 0, 0);
            }
            this.ctx.strokeRect(initialMousePos.x, initialMousePos.y, dx, dy);
        });
        this.mouseSpy.registerMouseUp(this, ({x, y}) => {

            if (!initialMousePos) return;
            const dx = x - initialMousePos.x;
            const dy = y - initialMousePos.y;

            const rectangle = elementsStore.addRectangle(initialMousePos.x, initialMousePos.y, dx, dy, canvasState.strokeStyle, canvasState.lineWidth);
            elementsStore.resetCanvas();

            canvasHistory.push(new AddSegmentSetCommit(rectangle));
            initialMousePos = null;
            cachedCanvasData = null;

        });
    }

    onDestroy() {
        this.mouseSpy.unregisterAll(this);
    }
}

export class RectangleToolActivator extends ToolActivator {
    name = 'Rectangle';
    icon = 'rectangle';
    for = RectangleTool;

    constructor(deps: ToolDependencies) {
        super(deps);
    }

    activate() {
        return new RectangleTool(this.deps.mouseSpy, this.deps.ctx);
    }
}