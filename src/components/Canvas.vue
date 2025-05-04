<template>
    <canvas ref="canvas" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTool } from '../composables/tools';
import { PenTool } from '../interface/tools/pen';
import { MouseSpy } from '../interface/tools/utils';
import { useToolboxes } from '../composables/toolboxes';
const canvas = ref(null);

const { setToolDependencies } = useToolboxes();

onMounted(() => {
    const canvasElement = canvas.value;
    const ctx = canvasElement.getContext('2d');
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    canvasElement.width = width;
    canvasElement.height = height;
    console.log(width, height);

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