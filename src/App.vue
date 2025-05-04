<script setup lang="ts">
import Canvas from './components/Canvas.vue';
import Tools from './components/Tools.vue';
</script>

<template>
  <div class="app">
    <Canvas class="canvas"/>
    <Tools/>
  </div>
</template>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
.tools-box {
  position: absolute;
  z-index: 1;
}
.app {
  height: 100vh;
  width: 100vw;
}
</style>
