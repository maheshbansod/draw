<script lang="ts" setup>
import ToolsBox from "./ToolsBox.vue";
import { useToolboxes } from "../composables/toolboxes";

const { toolBoxes } = useToolboxes();
</script>

<template>
  <div
    v-if="toolBoxes && toolBoxes.length > 0"
    v-for="toolBox in toolBoxes"
    :key="toolBox.id"
  >
    <ToolsBox v-bind="toolBox" />
  </div>
</template>
