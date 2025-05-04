import { ref } from "vue";
import type { Tool, ToolActivator } from "../interface/tools";

const currentTool = ref<Tool | null>(null);

export const useTool = () => {
    const setCurrentTool = (tool: Tool) => {    
        currentTool.value = tool;
    };

    const selectTool = (toolActivator: ToolActivator) => {
        if (currentTool.value) {
            currentTool.value.onDestroy();
        }
        const tool = toolActivator.activate();
        setCurrentTool(tool);
    };

    const isCurrentToolActivator = (toolActivator: ToolActivator) => {
        if (!currentTool.value) {
            return false;
        }
        return currentTool.value instanceof toolActivator.for;
    };

    return {
        currentTool,
        selectTool,
        isCurrentToolActivator,
    };
};
