<script lang="ts" setup>
import ToolsBox from './ToolsBox.vue';
import { useToolboxes } from '../composables/toolboxes';
import { onMounted, watch } from 'vue';

const { toolBoxes } = useToolboxes();

watch(toolBoxes, (newValue) => {
    console.log('toolBoxes changed:', newValue);
}, { immediate: true });

onMounted(() => {
    console.log('Tools component mounted, toolBoxes:', toolBoxes.value);
});
</script>

<template>
    <div v-if="toolBoxes && toolBoxes.length > 0" v-for="toolBox in toolBoxes" :key="toolBox.id">
        <ToolsBox v-bind="toolBox" />
    </div>
</template>