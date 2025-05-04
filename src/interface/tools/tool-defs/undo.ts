import { ToolActivator, type Tool } from "..";
import type { ToolDependencies } from "../deps";
import { canvasHistory } from "../../../composables/history";
export class UndoTool implements Tool {
    isInstant = true;
    constructor(
    ) {
        canvasHistory.undo();
    }
    onDestroy(): void {
        // do nothing
    }
}

export class UndoToolActivator extends ToolActivator {
    name = 'Undo';
    icon = 'undo';
    for = UndoTool;
    constructor(deps: ToolDependencies) {
        super(deps);
    }
    activate(): Tool {
        return new UndoTool();
    }
}