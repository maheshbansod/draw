import { CanvasHistoryManager } from "../interface/draw-board-manager";

// would this work?
export const canvasHistory = new CanvasHistoryManager();

// is this useless? idk
export function useHistory() {
    return {
        history: canvasHistory,
    };
}

