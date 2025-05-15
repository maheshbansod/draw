import type { Component } from "vue";
import type { Placeable } from "../types";
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
    tools: (ToolActivator|Component)[];
}

export interface Tool {
    /**
     * An instant tool is applied immediately when it is activated and
     * so it is deactivated immediately after it is activated.
     */
    isInstant?: boolean;
    onDestroy(): void;
}
