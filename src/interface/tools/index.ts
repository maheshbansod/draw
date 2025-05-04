import type { Placeable } from "../types";
import { PenToolActivator } from "./pen";
import type { ToolDependencies } from "./deps";
export class ToolActivator {
    // should be set by the subclass
    public name!: string;
    public icon!: string;
    public for!: new (...args: any[]) => Tool;

    constructor(
        public deps: ToolDependencies
    ) {}

    activate(): Tool {
        throw new Error('This needs to be implemented by the subclass');
    }
}

export type ToolBox = Placeable & {
    id: string;
    tools: ToolActivator[];
}

export interface Tool {
    onDestroy(): void;
}
