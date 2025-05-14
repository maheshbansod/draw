import { canvasState } from "../../../canvas/state";
import { canvasHistory } from "../../../composables/history";
import { elementsStore } from "../../elements";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";

export class CircleTool implements Tool {
  constructor(
    private mouseSpy: MouseSpy,
    private ctx: CanvasRenderingContext2D
  ) {
    let cachedCanvasData: ImageData | null = null;
    let initialMousePos: { x: number; y: number } | null = null;

    this.mouseSpy.registerMouseDown(this, ({ x, y }) => {
      cachedCanvasData = this.ctx.getImageData(
        0,
        0,
        this.ctx.canvas.width,
        this.ctx.canvas.height
      );
      initialMousePos = { x, y };
    });

    this.mouseSpy.registerMouseMove(this, ({ x, y }) => {
      if (!initialMousePos) return;
      const dx = x - initialMousePos.x;
      const dy = y - initialMousePos.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      // Prevent overflow: calculate the max allowed radius
      const maxRadius = Math.min(
        initialMousePos.x,
        initialMousePos.y,
        this.ctx.canvas.width - initialMousePos.x,
        this.ctx.canvas.height - initialMousePos.y
      );
      const clampedRadius = Math.min(radius, maxRadius);
      this.ctx.beginPath();
      this.ctx.arc(
        initialMousePos.x,
        initialMousePos.y,
        clampedRadius,
        0,
        Math.PI * 2
      );
      if (cachedCanvasData) {
        this.ctx.putImageData(cachedCanvasData, 0, 0);
      }
      this.ctx.stroke();
    });

    this.mouseSpy.registerMouseUp(this, ({ x, y }) => {
      if (!initialMousePos) return;
      const dx = x - initialMousePos.x;
      const dy = y - initialMousePos.y;
      const radius = Math.sqrt(dx * dx + dy * dy);

      const maxRadius = Math.min(
        initialMousePos.x,
        initialMousePos.y,
        this.ctx.canvas.width - initialMousePos.x,
        this.ctx.canvas.height - initialMousePos.y
      );
      const clampedRadius = Math.min(radius, maxRadius);

      const circle = elementsStore.addCircle(
        initialMousePos.x,
        initialMousePos.y,
        clampedRadius,
        canvasState.strokeStyle,
        canvasState.lineWidth
      );
      elementsStore.resetCanvas();

      canvasHistory.push({
        apply: () => {
          elementsStore.addLineSegmentSet(circle);
        },
        revert: () => {
          elementsStore.removeLineSegmentSet(circle);
        },
      });
      initialMousePos = null;
      cachedCanvasData = null;
    });
  }

  onDestroy() {
    this.mouseSpy.unregisterAll(this);
  }
}

export class CircleToolActivator extends ToolActivator {
  name = "Circle";
  icon = "circle";
  for = CircleTool;

  constructor(deps: ToolDependencies) {
    super(deps);
  }

  activate() {
    return new CircleTool(this.deps.mouseSpy, this.deps.ctx);
  }
}
