import { ToolActivator, type Tool } from "..";
import { canvasHistory } from "../../../composables/history";
import type { ToolDependencies } from "../deps";
class DeleteTool implements Tool {
    isInstant = true;
    constructor(
    ) {
        // todo: show a confirmation

        canvasHistory.clear();
    }
    onDestroy(): void {
        // do nothing
    }
}

export class DeleteToolActivator extends ToolActivator {
    name = 'Delete';
    icon = 'delete';
    for = DeleteTool;
    constructor(deps: ToolDependencies) {
        super(deps);
    }
    activate(): Tool {
        return new DeleteTool();
    }
}