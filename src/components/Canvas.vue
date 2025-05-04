<template>
    <canvas ref="canvas" />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { MouseSpy } from '../interface/tools/utils';
import { useToolboxes } from '../composables/toolboxes';
import { canvasState } from '../canvas/state';
const canvas = ref<HTMLCanvasElement | null>(null);

const { setToolDependencies } = useToolboxes();

onMounted(() => {
    const canvasElement = canvas.value;
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    canvasElement.width = width;
    canvasElement.height = height;
    console.log(`canvas size: ${width}x${height}`);

    ctx.strokeStyle = canvasState.strokeStyle;
    ctx.lineWidth = canvasState.lineWidth;

    ctx.fillStyle = canvasState.bgColor;
    ctx.fillRect(0, 0, width, height);

    watch(canvasState, () => {
        ctx.strokeStyle = canvasState.strokeStyle;
        ctx.lineWidth = canvasState.lineWidth;
    });

    // disable scroll
    canvasElement.addEventListener('wheel', (event) => {
        event.preventDefault();
        // todo: let's zoom in and out
    });

    const mouseSpy = new MouseSpy(canvasElement);
    setToolDependencies({
        mouseSpy,
        ctx,
    });

});

</script>