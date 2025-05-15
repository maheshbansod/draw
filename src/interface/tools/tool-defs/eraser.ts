import { canvasHistory } from "../../../composables/history";
import { elementsStore, LineSegmentSet } from "../../elements";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";
import { RemoveSegmentSetsCommit } from "../../history/commits/remove-segment-sets";
export class EraserTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy,
    ) {
        let removedSegments: LineSegmentSet[] = [];
        mouseSpy.registerMouseMove(this, ({isMouseDown, x, y}) => {
            if (!isMouseDown) return;
            const selected = elementsStore.selectLineSegmentAt(x, y);
            if (selected) {
                elementsStore.removeLineSegmentSet(selected);
                elementsStore.resetCanvas();
                removedSegments.push(selected);
            }
        });
        mouseSpy.registerMouseUp(this, () => {
            if (removedSegments.length === 0) return;
            const segments = [...removedSegments];
            removedSegments = [];
            canvasHistory.push(new RemoveSegmentSetsCommit(segments));
        });
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
        return new EraserTool(this.deps.mouseSpy);
    }
}