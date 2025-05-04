import { reactive } from "vue";

export const canvasState = reactive({
    bgColor: '#ffffff',
    strokeStyle: '#000000',
    lineWidth: 5,
}); 

export type CanvasState = typeof canvasState;