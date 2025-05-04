import { computed, shallowRef } from "vue";
import type { ToolDependencies } from "../interface/tools/deps";
import { defaultToolBoxes } from "../interface/tools/data";

const toolDependencies = shallowRef<ToolDependencies|null>(null);

export const useToolboxes = () => {
    const toolBoxes = computed(() => {
        console.log('toolBoxes computed accessed, toolDependencies:', toolDependencies.value);
        return toolDependencies.value ? defaultToolBoxes.map(toolBox => {
            const mouseSpy = toolDependencies.value!.mouseSpy;
            const ctx = toolDependencies.value!.ctx;
            return {
                ...toolBox,
                tools: toolBox.tools.map(tool => new tool({
                    mouseSpy,
                    ctx,
                })),
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