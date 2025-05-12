import { CanvasHistoryManager } from "../interface/history";

// would this work?
export const canvasHistory = new CanvasHistoryManager();
canvasHistory.loadHistory();

// is this useless? idk
export function useHistory() {
    return {
        history: canvasHistory,
    };
}

