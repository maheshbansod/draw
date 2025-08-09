import { canvasHistory } from "../../../composables/history";
import { isPointInRect } from "../../../utils/math";
import { elementsStore } from "../../elements";
import { MoveCommit } from "../../history/commits/move";
import type { ToolDependencies } from "../deps";
import { ToolActivator, type Tool } from "../index";
import type { MouseSpy } from "../utils";

enum PointerToolMode {
  Drag, // can move selected stuff
  RectSelect, // draws a rectangle or selects on clicking on something directly
}

export class PointerTool implements Tool {
  constructor(
    private mouseSpy: MouseSpy,
    private ctx: CanvasRenderingContext2D
  ) {
    let currentMode: PointerToolMode | null = null;
    const setupRectSelectAbility = () => {
      let startMousePos: { x: number, y: number } | null = null;
      let endMousePos: { x: number, y: number } | null = null;
      let cachedCanvasData: ImageData | null = null;
      this.mouseSpy.registerMouseDown(this, ({ x, y }) => {
        if (currentMode !== null) {
          return;
        }
        const selected = elementsStore.selectLineSegmentAt(x, y);
        if (!selected) {
          elementsStore.setSelectedLineSegmentSet(null);
          currentMode = PointerToolMode.RectSelect;
          startMousePos = { x, y };
          cachedCanvasData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        } else {
          elementsStore.setSelectedLineSegmentSet(selected);
          currentMode = PointerToolMode.Drag;
        }
      });

      this.mouseSpy.registerMouseMove(this, ({ x, y }) => {
        if (!startMousePos || currentMode !== PointerToolMode.RectSelect) {
          return;
        }
        endMousePos = { x, y };
        const w = endMousePos.x - startMousePos.x;
        const h = endMousePos.y - startMousePos.y;
        if (cachedCanvasData) {
          this.ctx.putImageData(cachedCanvasData, 0, 0);
        }
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.rect(startMousePos.x, startMousePos.y, w, h);
        this.ctx.stroke();
      });
      this.mouseSpy.registerMouseUp(this, () => {
        if (!startMousePos || currentMode !== PointerToolMode.RectSelect) return;
        if (endMousePos && !(endMousePos.x === startMousePos.x && endMousePos.y === startMousePos.y)) {
          const w = endMousePos.x - startMousePos.x;
          const h = endMousePos.y - startMousePos.y;
          const segmentsToSelect = elementsStore.getSegmentSetsWithinRect({ x: startMousePos.x, y: startMousePos.y, w, h });
          elementsStore.extendSelectedLineSegmentSets(segmentsToSelect);
          currentMode = PointerToolMode.Drag;
        } else {
          elementsStore.setSelectedLineSegmentSet(null);
        }
        elementsStore.resetCanvas();
        startMousePos = null;
        // currentMode = null;
      });
    };
    const setUpDragAbility = () => {
      let startMousePos: { x: number, y: number } | null = null;
      let initialSegmentSetPosition: { x: number, y: number } | null = null;
      let cachedCanvasData: ImageData | null = null;

      this.mouseSpy.registerMouseDown(this, ({ x, y }) => {
        if (currentMode !== PointerToolMode.Drag) {
          return;
        }
        const selectedBounds = elementsStore.getSelectedSetsBoundingRect()
        if (selectedBounds) {
          if (!isPointInRect(x, y, selectedBounds)) {
            elementsStore.setSelectedLineSegmentSet(null);
            startMousePos = null;
            endMousePos = null;
            elementsStore.resetCanvas()
            return;
          }
        }
        const firstPoint = elementsStore.selectedSetFirstPoint();
        if (firstPoint) {
          startMousePos = { x, y };
          initialSegmentSetPosition = firstPoint;
          cachedCanvasData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
          currentMode = PointerToolMode.Drag;
        } else {
          elementsStore.setSelectedLineSegmentSet(null);
          elementsStore.resetCanvas();
          currentMode = null;
        }
      });

      let endMousePos: { x: number, y: number } | null = null;
      this.mouseSpy.registerMouseMove(this, ({ x, y }) => {
        if (!startMousePos || !initialSegmentSetPosition) return;
        const selectedSegmentSets = elementsStore.getSelectedLineSegmentSets();
        if (!selectedSegmentSets || !selectedSegmentSets[0]) return;
        endMousePos = { x, y };
        const currentFirstPoint = elementsStore.selectedSetFirstPoint();
        if (!currentFirstPoint) {
          return;
        }
        const mouseDelta = {
          x: x - startMousePos.x,
          y: y - startMousePos.y
        };
        const newFirstPoint = {
          x: initialSegmentSetPosition.x + mouseDelta.x,
          y: initialSegmentSetPosition.y + mouseDelta.y
        };
        const dx = newFirstPoint.x - currentFirstPoint.x;
        const dy = newFirstPoint.y - currentFirstPoint.y;
        for (const selectedSegmentSet of selectedSegmentSets) {
          selectedSegmentSet.translate(dx, dy);
        }
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (cachedCanvasData) {
          this.ctx.putImageData(cachedCanvasData, 0, 0);
        }
        this.ctx.beginPath();
        for (const selectedSegmentSet of selectedSegmentSets) {
          selectedSegmentSet.draw(this.ctx);
        }
        this.ctx.stroke();
      });

      this.mouseSpy.registerMouseUp(this, () => {
        if (!endMousePos || !startMousePos) {
          startMousePos = null;
          return;
        }
        const selectedSegmentSets = elementsStore.getSelectedLineSegmentSets();
        if (!selectedSegmentSets || !selectedSegmentSets[0]) return;
        const dx = endMousePos.x - startMousePos.x;
        const dy = endMousePos.y - startMousePos.y;
        if (dx === 0 && dy === 0) return;

        elementsStore.resetCanvas();
        const segmentSets = selectedSegmentSets;

        for (const segmentSet of segmentSets) {
          canvasHistory.push(new MoveCommit(segmentSet, dx, dy));
        }
        startMousePos = null;
        // currentMode = null;
      });
    }
    setUpDragAbility();
    setupRectSelectAbility();
  }

  onDestroy() {
    this.mouseSpy.unregisterAll(this);
  }
}

export class PointerToolActivator extends ToolActivator {
  name = 'Pointer';
  icon = 'pointer';
  for = PointerTool;

  constructor(deps: ToolDependencies) {
    super(deps);
  }

  activate() {
    return new PointerTool(this.deps.mouseSpy, this.deps.ctx);
  }
}
