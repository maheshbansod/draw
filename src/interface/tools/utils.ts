
type MouseSpyMoveListenerParams = {
    isMouseDown: boolean;
    x: number;
    y: number;
    previousX: number;
    previousY: number;
    event: MouseEvent;
}

export class MouseSpy {
    private isMouseDown = false;
    private previousX = 0;
    private previousY = 0;
    private currentX = 0;
    private currentY = 0;
    private listeners: Map<unknown, {
        onMouseDown: ((params: MouseSpyMoveListenerParams) => void)[];
        onMouseMove: ((params: MouseSpyMoveListenerParams) => void)[];
        onMouseUp: ((params: MouseSpyMoveListenerParams) => void)[];
    }> = new Map();
    constructor(private canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const canvasRect = canvas.getBoundingClientRect();
        const resolveX = (event: MouseEvent) => {
            return event.clientX - canvasRect.left;
        };
        const resolveY = (event: MouseEvent) => {
            return event.clientY - canvasRect.top;
        };
        const onMouseDown = (event: MouseEvent) => {
            this.isMouseDown = true;
            this.previousX = resolveX(event);
            this.previousY = resolveY(event);
            this.currentX = resolveX(event);
            this.currentY = resolveY(event);
            this.listeners.forEach((listener) => {
                listener.onMouseDown.forEach((listener) => {
                    listener({
                        isMouseDown: this.isMouseDown,
                        x: this.currentX,
                        y: this.currentY,
                        previousX: this.previousX,
                        previousY: this.previousY,
                        event,
                    });
                });
            });
        }
        const onMouseMove = (event: MouseEvent) => {
            this.previousX = this.currentX;
            this.previousY = this.currentY;

            this.currentX = resolveX(event);
            this.currentY = resolveY(event);
            this.listeners.forEach((listener) => {
                listener.onMouseMove.forEach((listener) => {
                    listener({
                        isMouseDown: this.isMouseDown,
                        x: this.currentX,
                        y: this.currentY,
                        previousX: this.previousX,
                        previousY: this.previousY,
                        event,
                    });
                });
            });
        }
        const onMouseUp = (event: MouseEvent) => {
            this.isMouseDown = false;
            this.listeners.forEach((listener) => {
                listener.onMouseUp.forEach((listener) => {
                    listener({
                        isMouseDown: this.isMouseDown,
                        x: this.currentX,
                        y: this.currentY,
                        previousX: this.previousX,
                        previousY: this.previousY,
                        event,
                    });
                });
            });
        }
        this.canvas.addEventListener('mousedown', onMouseDown);
        this.canvas.addEventListener('mousemove', onMouseMove);
        this.canvas.addEventListener('mouseup', onMouseUp);
    }
    registerMouseDown(by: unknown, listener: (params: MouseSpyMoveListenerParams) => void) {
        const listeners = this.listeners.get(by) || {
            onMouseDown: [],
            onMouseMove: [],
            onMouseUp: [],
        };
        listeners.onMouseDown.push(listener);
        this.listeners.set(by, listeners);
    }
    registerMouseMove(by: unknown, listener: (params: MouseSpyMoveListenerParams) => void) {
        const listeners = this.listeners.get(by) || {
            onMouseDown: [],
            onMouseMove: [],
            onMouseUp: [],
        };
        listeners.onMouseMove.push(listener);
        this.listeners.set(by, listeners);
    }
    registerMouseUp(by: unknown, listener: (params: MouseSpyMoveListenerParams) => void) {
        const listeners = this.listeners.get(by) || {
            onMouseDown: [],
            onMouseMove: [],
            onMouseUp: [],
        };
        listeners.onMouseUp.push(listener);
        this.listeners.set(by, listeners);
    }
    unregisterAll(by: unknown) {
        this.listeners.delete(by);
    }
}
