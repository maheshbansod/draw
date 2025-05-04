import type { MouseSpy } from "./utils";

export type ToolDependencies = {
    mouseSpy: MouseSpy;
    ctx: CanvasRenderingContext2D;
}