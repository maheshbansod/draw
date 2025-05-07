
export function isPointOnLine(
    x: number, y: number, start: { x: number, y: number }, end: { x: number, y: number },
    strokeWidth: number = 1,
) {
    if (!isInRange(x, start.x - strokeWidth, end.x + strokeWidth)
        || !isInRange(y, start.y - strokeWidth, end.y + strokeWidth)
    ) {
        return false;
    }
    if (Math.abs(end.x - start.x) < strokeWidth) {
        // i already know y is in range from the previous check
        return true;
    }
    const expectedY = (x - start.x) * (end.y - start.y) / (end.x - start.x) + start.y;
    const yDiff = Math.abs(expectedY - y);
    return yDiff <= strokeWidth;
}

export function isInRange(value: number, a: number, b: number) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return value >= min && value <= max;
}