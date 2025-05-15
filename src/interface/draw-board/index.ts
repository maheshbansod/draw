import type { LineSegment } from "../elements";

export class DrawBoard {
    zoom: number = 1;
    constructor(
        public readonly canvas: HTMLCanvasElement,
    ) {
    }

    drawLine(line: LineSegment) {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.stroke();
    }

    zoomIn() {
        this.zoom *= 2;
        this.canvas.style.transform = `scale(${this.zoom})`;
    }

    zoomOut() {
        this.zoom /= 2;
        this.canvas.style.transform = `scale(${this.zoom})`;
    }

    resetZoom() {
        this.zoom = 1;
        this.canvas.style.transform = `scale(${this.zoom})`;
    }
}
