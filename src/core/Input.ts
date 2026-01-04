import { Vector2 } from '../utils/Vector2';

export class Input {
    private keys: Set<string> = new Set();
    private mousePos: Vector2 = new Vector2(0, 0);
    private isMouseDown: boolean = false;

    constructor() {
        this.init();
    }

    private init(): void {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });

        window.addEventListener('mousemove', (e) => {
            // Mouse position relative to the client area
            // Note: We might need to adjust for canvas offset if it's not full screen, 
            // but css makes it full screen.
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            this.isMouseDown = true;
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    public isKeyDown(code: string): boolean {
        return this.keys.has(code);
    }

    public getMousePos(): Vector2 {
        return this.mousePos.clone();
    }

    public getIsMouseDown(): boolean {
        return this.isMouseDown;
    }
}
