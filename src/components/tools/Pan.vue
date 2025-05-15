<script lang="ts" setup>
import { watch } from 'vue';
import { canvasState } from '../../canvas/state';
import { elementsStore } from '../../interface/elements';
const panLeft = () => {
    canvasState.pan.x -= 10;
}

const panUp = () => {
    canvasState.pan.y -= 10;
}

const panDown = () => {
    canvasState.pan.y += 10;
}

const panRight = () => {
    canvasState.pan.x += 10;
}

watch(canvasState.pan, () => {
    elementsStore.resetCanvas();
})
</script>

<template>

<div>

    <div class="flex gap-2">
        <button @click="panLeft">
            Left
        </button>
        <div class="flex flex-col gap-2">
            <button @click="panUp">
                Up
            </button>
            <button @click="panDown">
                Down
            </button>
        </div>
        <button @click="panRight">
            Right
        </button>
    </div>

</div>

</template>