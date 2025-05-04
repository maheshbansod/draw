<script lang="ts" setup>
import { markRaw, ref } from 'vue';
import type { ToolBox } from '../interface/tools/index';
import { useTool } from '../composables/tools';
const props = defineProps<ToolBox>();

const tools = ref(props.tools.map(tool => markRaw(tool)));
const x = ref(props.x);
const y = ref(props.y);
const width = ref(props.width);
const height = ref(props.height);

const { selectTool, isCurrentToolActivator } = useTool();
</script>

<template>
    <div class="tools-box" :style="{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
    }">
        <div class="tools-box-item" v-for="tool in tools" :key="tool.name">
            <button
                class="cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 transition-colors px-2 py-1"
                :class="{ 'bg-gray-300': isCurrentToolActivator(tool) }"
                @click="selectTool(tool)"
            >
                {{ tool.name }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.tools-box {
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    position: absolute;
}
</style>