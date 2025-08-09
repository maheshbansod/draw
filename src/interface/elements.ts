import { canvasState } from "../canvas/state";
import { drawLine, drawLines } from "../utils/canvas";
import { isPointOnLine, isLineInRect } from "../utils/math";
import type { Serializeable } from "../utils/serialize";
import { SerializeableName, type Deserializer, type SerOutput } from "./serializers";
export type LineSegment = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export class LineSegmentSet implements Serializeable {
  constructor(
    private segments: LineSegment[] = [],
    /**
     * If true, the last segment will be connected to the first segment
     */
    public readonly strokeStyle: string = 'black',
    public readonly lineWidth: number = 1,
    public readonly loop: boolean = false,
  ) {
  }
  serialize(): SerOutput {
    return {
      name: SerializeableName.LineSegmentSet,
      data: {
        segments: this.segments.map(segment => ({ ...segment })),
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
        loop: this.loop,
      }
    }
  }

  containsPoint(x: number, y: number) {
    for (const segment of this.segments) {
      if (isPointOnLine(x, y, segment.start, segment.end, this.lineWidth)) {
        return true;
      }
    }
  }

  isCompletelyInRect(rect: { x: number, y: number, w: number, h: number }) {
    for (const segment of this.segments) {
      if (!isLineInRect(segment, rect)) {
        return false;
      }
    }
    return true;
  }

  firstPoint() {
    const start = { ...this.segments[0].start };
    start.x += canvasState.pan.x;
    start.y += canvasState.pan.y;
    return start;
  }
  translate(dx: number, dy: number) {
    for (const segment of this.segments) {
      segment.start.x += dx;
      segment.start.y += dy;
      segment.end.x += dx;
      segment.end.y += dy;
    }
  }

  isEmpty() {
    return this.segments.length == 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    drawLines(ctx, this.segments);
    if (this.loop) {
      const lastSegment = this.segments[this.segments.length - 1];
      const firstSegment = this.segments[0];
      drawLine(ctx, lastSegment.end, firstSegment.start);
    }
  }

  getSegments() {
    return this.segments.map(segment => ({ ...segment }));
  }
}

export class LineSegmentSetDeserializer implements Deserializer<LineSegmentSet> {
  /**
   * TODO: should i use some library or something?
   * @param obj 
   * @returns 
   */
  deserialize(obj: SerOutput): LineSegmentSet {
    const segmentsRaw = obj.data.segments;
    if (typeof segmentsRaw !== 'object' || segmentsRaw === null) {
      throw new Error('segments is not an object');
    }
    if (
      segmentsRaw === null
      || (!('length' in segmentsRaw)
        || typeof segmentsRaw.length !== 'number')
      || !Array.isArray(segmentsRaw)
    ) {
      throw new Error('segments is not an array');
    }

    const segments = segmentsRaw.map((segment) => {
      if (typeof segment !== 'object' || segment === null) {
        throw new Error('segment is not an object');
      }
      if (!('start' in segment)) {
        throw new Error('segment is not an object');
      }
      if (typeof segment.start !== 'object' || segment.start === null) {
        throw new Error('segment.start is not an object');
      }
      if (!('x' in segment.start)) {
        throw new Error('segment.start is not an object');
      }
      if (!('y' in segment.start)) {
        throw new Error('segment.start is not an object');
      }
      if (typeof segment.start.x !== 'number') {
        throw new Error('segment.start.x is not a number');
      }
      if (typeof segment.start.y !== 'number') {
        throw new Error('segment.start.y is not a number');
      }
      if (typeof segment.end !== 'object' || segment.end === null) {
        throw new Error('segment.end is not an object');
      }
      if (!('x' in segment.end)) {
        throw new Error('segment.end is not an object');
      }
      if (!('y' in segment.end)) {
        throw new Error('segment.end is not an object');
      }
      if (typeof segment.end.x !== 'number') {
        throw new Error('segment.end.x is not a number');
      }
      if (typeof segment.end.y !== 'number') {
        throw new Error('segment.end.y is not a number');
      }
      return {
        start: {
          x: segment.start.x,
          y: segment.start.y,
        },
        end: {
          x: segment.end.x,
          y: segment.end.y,
        },
      }
    });
    const strokeStyle = obj.data.strokeStyle;
    if (typeof strokeStyle !== 'string') {
      throw new Error('strokeStyle is not a string');
    }
    const lineWidth = obj.data.lineWidth;
    if (typeof lineWidth !== 'number') {
      throw new Error('lineWidth is not a number');
    }
    const loop = obj.data.loop;
    if (typeof loop !== 'boolean') {
      throw new Error('loop is not a boolean');
    }
    const segmentSet = new LineSegmentSet(segments, strokeStyle, lineWidth, loop);
    return segmentSet;
  }
}

class ElementStore {
  /**
   * All the line segment sets that are drawn
   * */
  private lineSegmentSets: LineSegmentSet[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private selectedLineSegmentSets: LineSegmentSet[] = [];
  constructor(
  ) {
  }

  setCtx(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear() {
    this.lineSegmentSets = [];
    this.selectedLineSegmentSets = [];
  }

  drawSelectedLineSegmentSetOutline() {
    if (!this.selectedLineSegmentSets[0]) return;
    if (!this.ctx) return;

    // for now let's say i show selection only as a single pixel segment set

    for (const selectedLineSegmentSet of this.selectedLineSegmentSets) {
      const outlineSegmentSet = new LineSegmentSet(selectedLineSegmentSet.getSegments(), 'cyan', 1, selectedLineSegmentSet.loop);
      outlineSegmentSet.draw(this.ctx);
    }
  }

  resetCanvas() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.save();
    ctx.strokeStyle = canvasState.strokeStyle;
    ctx.lineWidth = canvasState.lineWidth;

    ctx.fillStyle = canvasState.bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.translate(canvasState.pan.x, canvasState.pan.y);
    this.lineSegmentSets.forEach((segment) => {
      ctx.beginPath();
      segment.draw(ctx);
      ctx.stroke();
    });
    ctx.beginPath();
    if (this.selectedLineSegmentSets) {
      this.drawSelectedLineSegmentSetOutline();
    }
    ctx.stroke();
    ctx.restore();
  }

  removeLineSegmentSet(segment: LineSegmentSet) {
    this.lineSegmentSets.splice(this.lineSegmentSets.indexOf(segment), 1);
  }

  extendSelectedLineSegmentSets(segmentSets: LineSegmentSet[]) {
    segmentSets.forEach(segmentSet => this.selectedLineSegmentSets.push(segmentSet));
  }

  setSelectedLineSegmentSet(segmentSet: LineSegmentSet | null) {
    if (!segmentSet) {
      this.selectedLineSegmentSets = [];
      return;
    }
    this.selectedLineSegmentSets = [segmentSet];
  }

  getSegmentSetsWithinRect(rect: { x: number, y: number, w: number, h: number }): LineSegmentSet[] {
    return this.lineSegmentSets.filter(segmentSet => segmentSet.isCompletelyInRect(rect));
  }
  selectLineSegmentAt(x: number, y: number) {
    x -= canvasState.pan.x;
    y -= canvasState.pan.y;
    for (const segment of this.lineSegmentSets) {
      if (segment.containsPoint(x, y)) {
        return segment;
      }
    }
  }

  /**
   * Returns a bounding rect that contains all segments within the selected segment sets
   * */
  getSelectedSetsBoundingRect() {
    if (!this.selectedLineSegmentSets || !this.selectedLineSegmentSets.length) {
      return;
    }
    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;
    this.selectedLineSegmentSets.flatMap(s => s.getSegments()).forEach(s => {
      minx = Math.min(minx, s.start.x, s.end.x);
      maxx = Math.max(maxx, s.start.x, s.end.x);
      miny = Math.min(miny, s.start.y, s.end.y);
      maxy = Math.max(maxy, s.start.y, s.end.y);
    });
    if (minx > maxx || miny > maxy) {
      return;
    }
    return {
      x: minx,
      y: miny,
      w: maxx - minx,
      h: maxy - miny
    };
  }

  getSelectedLineSegmentSets() {
    return this.selectedLineSegmentSets;
  }

  addLineSegmentSet(segment: LineSegmentSet) {
    segment.translate(-canvasState.pan.x, -canvasState.pan.y);
    this.lineSegmentSets.push(segment);
  }

  addRectangle(
    x: number, y: number, width: number, height: number,
    strokeStyle: string = 'black',
    lineWidth: number = 1,
  ) {
    x -= canvasState.pan.x;
    y -= canvasState.pan.y;
    const segmentSet = new LineSegmentSet([
      { start: { x, y }, end: { x: x + width, y } },
      { start: { x: x + width, y }, end: { x: x + width, y: y + height } },
      { start: { x: x + width, y: y + height }, end: { x, y: y + height } },
    ], strokeStyle, lineWidth, true);
    this.lineSegmentSets.push(segmentSet);
    return segmentSet;
  }

  selectedSetFirstPoint() {
    const firstNonEmptySegmentSet = this.selectedLineSegmentSets.find(s => !s.isEmpty());
    if (!firstNonEmptySegmentSet) {
      return;
    }
    return firstNonEmptySegmentSet.firstPoint();
  }
}
export const elementsStore = new ElementStore();
