import { elementsStore } from "../../elements";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";

export class PointerTool implements Tool {
    constructor(
        private mouseSpy: MouseSpy
    ) {
        this.mouseSpy.registerMouseDown(this, ({x, y}) => {
            // see if there's any object at this position
            // i might have to do this on a separate web worker if it's expensive
            const selected = elementsStore.selectLineSegmentAt(x, y);
            if (selected) {
                console.log('selected', selected);
                // can convert to drag element mode
            } else {
                // empty area clicked -> can convert to drag mode
                console.log('empty area clicked -> can convert to drag canvas');
            }
        })
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
        return new PointerTool(this.deps.mouseSpy);
    }
}