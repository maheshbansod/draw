import { PenToolActivator } from "./tool-defs/pen";
import { EraserToolActivator } from "./tool-defs/eraser";
export const defaultToolBoxes = [
    {
        id: 'toolbox-1',
        tools: [
            PenToolActivator,
            EraserToolActivator,
        ],
        x: 0,
        y: 0,
        width: 100,
        height: 100,
    },
] as const;