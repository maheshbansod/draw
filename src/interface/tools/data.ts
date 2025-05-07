import { PenToolActivator } from "./tool-defs/pen";
import { EraserToolActivator } from "./tool-defs/eraser";
import { UndoToolActivator } from "./tool-defs/undo";
import { PointerToolActivator } from "./tool-defs/pointer";
import { RectangleToolActivator } from "./tool-defs/rectangle";
export const defaultToolBoxes = [
    {
        id: 'toolbox-1',
        tools: [
            PenToolActivator,
            EraserToolActivator,
            PointerToolActivator,
            RectangleToolActivator,
        ],
        placement: {
            bottom: 0,
        }
    },
    {
        id: 'toolbox-2',
        tools: [
            UndoToolActivator,
        ],
        placement: {
            top: 0,
            right: 0,
        }
    }
] as const;