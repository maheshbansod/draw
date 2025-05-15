import { computed, shallowRef } from "vue";
import type { ToolDependencies } from "../interface/tools/deps";
import { defaultToolBoxes } from "../interface/tools/data";
import { ToolActivator } from "../interface/tools";

const toolDependencies = shallowRef<ToolDependencies|null>(null);

export const useToolboxes = () => {
    const toolBoxes = computed(() => {
        return toolDependencies.value ? defaultToolBoxes.map(toolBox => {
            const mouseSpy = toolDependencies.value!.mouseSpy;
            const ctx = toolDependencies.value!.ctx;
            return {
                ...toolBox,
                tools: toolBox.tools.map(tool => tool.prototype instanceof ToolActivator ? new tool({
                    mouseSpy,
                    ctx,
                }) : tool),
            }
        }) : null;
    });
    const setToolDependencies = (newToolDependencies: ToolDependencies) => {
        toolDependencies.value = newToolDependencies;
    }
    return {
        toolBoxes,
        setToolDependencies,
    }
}