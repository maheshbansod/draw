import { ref } from "vue";
import type { Tool, ToolActivator } from "../interface/tools";

const currentTool = ref<Tool | null>(null);

export const useTool = () => {
    const setCurrentTool = (tool: Tool) => {    
        currentTool.value = tool;
    };

    const selectTool = (toolActivator: ToolActivator) => {
        const tool = toolActivator.activate();

        if (currentTool.value && !tool.isInstant) {
            currentTool.value.onDestroy();
        }
        if (tool.isInstant) {
            tool.onDestroy();
        } else {
            setCurrentTool(tool);
        }
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
