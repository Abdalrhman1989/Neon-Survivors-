import { Vector2 } from '../utils/Vector2';

export class Enemy {
    public position: Vector2;
    public active: boolean = false;

    public radius: number = 12;
    private speed: number = 100;

    // Health could go here later

    constructor() {
        this.position = new Vector2(0, 0);
    }

    public activate(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.active = true;
    }

    public deactivate(): void {
        this.active = false;
    }

    public update(dt: number, targetPos: Vector2): void {
        if (!this.active) return;

        // Chase target
        const dir = targetPos.sub(this.position);
        if (dir.mag() > 0) {
            const move = dir.normalize().mult(this.speed * dt);
            this.position = this.position.add(move);
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        // Rotate slowly for visual effect
        const time = Date.now() / 1000;
        ctx.rotate(time);

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3333';
        ctx.strokeStyle = '#ff3333';
        ctx.lineWidth = 2;

        // Draw diamond
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius, 0);
        ctx.lineTo(0, this.radius);
        ctx.lineTo(-this.radius, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}
