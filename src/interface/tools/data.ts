import { PenToolActivator } from "./pen";

export const defaultToolBoxes = [
    {
        id: 'toolbox-1',
        tools: [
            PenToolActivator,
        ],
        x: 0,
        y: 0,
        width: 100,
        height: 100,
    },
] as const;