<script lang="ts" setup>
import { markRaw, ref, computed } from 'vue';
import type { ToolBox } from '../interface/tools/index';
import { ToolActivator } from '../interface/tools';
import { useTool } from '../composables/tools';
const props = defineProps<ToolBox>();

const tools = ref(props.tools.map(tool => markRaw(tool)));

const { selectTool, isCurrentToolActivator } = useTool();
const toolboxPlacementStyle = computed(() => {
    return {
        left: props.placement.left !== undefined ? `${props.placement.left}px` : undefined,
        top: props.placement.top !== undefined ? `${props.placement.top}px` : undefined,
        bottom: props.placement.bottom !== undefined ? `${props.placement.bottom}px` : undefined,
        right: props.placement.right !== undefined ? `${props.placement.right}px` : undefined,
        width: props.placement.width !== undefined ? `${props.placement.width}px` : undefined,
        height: props.placement.height !== undefined ? `${props.placement.height}px` : undefined,
    }
});
</script>

<template>
    <div class="tools-box" :style="toolboxPlacementStyle">
        <div class="tools-box-item" v-for="tool in tools" :key="tool.name">
            <button v-if="tool instanceof ToolActivator"
                class="cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 transition-colors px-2 py-1 select-none"
                :class="{ 'bg-gray-300': isCurrentToolActivator(tool) }"
                @click="selectTool(tool)"
            >
                {{ tool.name }}
            </button>
            <component v-else :is="tool" />
        </div>
    </div>
</template>

<style scoped>
.tools-box {
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    position: absolute;
    display: flex;
    gap: 10px;
}
</style>