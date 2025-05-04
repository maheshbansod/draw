
export function drawLine(ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number }) {
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
}

export function drawLines(ctx: CanvasRenderingContext2D, lines: { start: { x: number, y: number }, end: { x: number, y: number } }[]) {
    lines.forEach((line) => {
        drawLine(ctx, line.start, line.end);
    });
}