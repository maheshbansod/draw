import { canvasHistory } from "../../../composables/history";
import { elementsStore } from "../../elements";
import { MoveCommit } from "../../history/commits/move";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";

export class PointerTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
        private ctx: CanvasRenderingContext2D
    ) {
        let startMousePos: {x: number, y: number} | null = null;
        let initialSegmentSetPosition: {x: number, y: number} | null = null;
        let cachedCanvasData: ImageData | null = null;

        this.mouseSpy.registerMouseDown(this, ({x, y}) => {
            // see if there's any object at this position
            // i might have to do this on a separate web worker if it's expensive
            const selected = elementsStore.selectLineSegmentAt(x, y);
            if (selected) {
                elementsStore.setSelectedLineSegmentSet(selected);
                startMousePos = {x, y};
                initialSegmentSetPosition = selected.firstPoint();
                cachedCanvasData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                // can convert to drag element mode
            } else {
                // empty area clicked -> can convert to drag mode
                console.log('empty area clicked -> can convert to drag canvas');
                elementsStore.setSelectedLineSegmentSet(null);
                elementsStore.resetCanvas();
            }
        });

        let endMousePos: {x: number, y: number} | null = null;
        this.mouseSpy.registerMouseMove(this, ({x, y}) => {
            if (!startMousePos || !initialSegmentSetPosition) return;
            const selectedSegmentSet = elementsStore.getSelectedLineSegmentSet();
            if (!selectedSegmentSet) return;
            endMousePos = {x, y};
            const currentFirstPoint = selectedSegmentSet.firstPoint();
            const mouseDelta = {
                x: x - startMousePos.x,
                y: y - startMousePos.y
            };
            const newFirstPoint = {
                x: initialSegmentSetPosition.x + mouseDelta.x,
                y: initialSegmentSetPosition.y + mouseDelta.y
            };
            const dx = newFirstPoint.x - currentFirstPoint.x;
            const dy = newFirstPoint.y - currentFirstPoint.y;
            selectedSegmentSet.translate(dx, dy);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            if (cachedCanvasData) {
                this.ctx.putImageData(cachedCanvasData, 0, 0);
            }
            this.ctx.beginPath();
            selectedSegmentSet.draw(this.ctx);
            this.ctx.stroke();
        });

        this.mouseSpy.registerMouseUp(this, () => {
            if (!endMousePos || !startMousePos) {
                startMousePos = null;
                return;
            }
            const selectedSegmentSet = elementsStore.getSelectedLineSegmentSet();
            if (!selectedSegmentSet) return;
            const dx = endMousePos.x - startMousePos.x;
            const dy = endMousePos.y - startMousePos.y;
            if (dx === 0 && dy === 0) return;

            elementsStore.resetCanvas();
            const segmentSet = selectedSegmentSet;

            canvasHistory.push(new MoveCommit(segmentSet, dx, dy));
            startMousePos = null;
        });
    }

    onDestroy() {
        this.mouseSpy.unregisterAll(this);
    }
}

export class PointerToolActivator extends ToolActivator {
    name = 'Pointer';
    icon = 'pointer';
    for = PointerTool;

    constructor(deps: ToolDependencies) {
        super(deps);
    }

    activate() {
        return new PointerTool(this.deps.mouseSpy, this.deps.ctx);
    }
}