import { Vector2 } from '../utils/Vector2';

export class Bullet {
    public position: Vector2;
    public velocity: Vector2;
    public active: boolean = false;

    public radius: number = 4;
    private speed: number = 800;
    private lifeTime: number = 0;
    private maxLifeTime: number = 2;

    constructor() {
        this.position = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
    }

    public activate(x: number, y: number, angle: number): void {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this.lifeTime = 0;
        this.active = true;
    }

    public deactivate(): void {
        this.active = false;
    }

    public update(dt: number): void {
        if (!this.active) return;

        this.position = this.position.add(this.velocity.mult(dt));
        this.lifeTime += dt;

        if (this.lifeTime > this.maxLifeTime) {
            this.deactivate();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        ctx.save();
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff00ff';

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
