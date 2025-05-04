<template>
    <canvas ref="canvas" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { MouseSpy } from '../interface/tools/utils';
import { useToolboxes } from '../composables/toolboxes';
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

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    

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