import { PenToolActivator } from "./tool-defs/pen";
import { EraserToolActivator } from "./tool-defs/eraser";
import { UndoToolActivator } from "./tool-defs/undo";
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
    {
        id: 'toolbox-2',
        tools: [
            UndoToolActivator,
        ],
        x: 0,
        y: 100,
        width: 100,
        height: 100,
    }
] as const;