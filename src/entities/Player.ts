import { Input } from '../core/Input';
import { Vector2 } from '../utils/Vector2';
import { Weapon } from './Weapon';

export class Player {
    public position: Vector2;
    public rotation: number = 0; // Radians
    private speed: number = 300; // Pixels per second
    // private radius: number = 15; // Unused for now

    public maxHp: number = 100;
    public hp: number = 100;

    public weapon: Weapon;

    constructor(x: number, y: number, onFire: (x: number, y: number, a: number) => void) {
        this.position = new Vector2(x, y);
        this.hp = this.maxHp;
        this.weapon = new Weapon(onFire);
    }

    public takeDamage(amount: number): void {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    public isDead(): boolean {
        return this.hp <= 0;
    }

    private walkWobble: number = 0;

    public update(dt: number, input: Input): void {
        // Movement
        const moveDir = new Vector2(0, 0);
        if (input.isKeyDown('KeyW')) moveDir.y -= 1;
        if (input.isKeyDown('KeyS')) moveDir.y += 1;
        if (input.isKeyDown('KeyA')) moveDir.x -= 1;
        if (input.isKeyDown('KeyD')) moveDir.x += 1;

        if (moveDir.mag() > 0) {
            moveDir.normalize();
            this.position = this.position.add(moveDir.mult(this.speed * dt));
            this.walkWobble += dt * 15; // Animation speed
        } else {
            this.walkWobble = 0; // Reset when stopped
        }

        // Rotation (aim towards mouse)
        const mousePos = input.getMousePos();
        // Vector from player to mouse
        const dx = mousePos.x - this.position.x;
        const dy = mousePos.y - this.position.y;
        this.rotation = Math.atan2(dy, dx);

        this.weapon.update(dt);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        // Tech / Neon Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.fillStyle = '#00ffff';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;

        // "Shooter Person" Construction

        // 1. Legs (Wobble)
        const leftLegOffset = Math.sin(this.walkWobble) * 5;
        const rightLegOffset = Math.sin(this.walkWobble + Math.PI) * 5;

        ctx.beginPath();
        ctx.arc(-5, 5 + leftLegOffset, 4, 0, Math.PI * 2); // Left Foot
        ctx.arc(5, 5 + rightLegOffset, 4, 0, Math.PI * 2); // Right Foot
        ctx.fill();

        // 2. Body
        ctx.fillStyle = '#0a0a1a'; // Dark suit
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke(); // Neon outline

        // 3. Head
        ctx.fillStyle = '#111'; // Helmet
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        // Visor
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.rect(0, -3, 6, 6); // Visor looking forward (relative to rotation)
        ctx.fill();

        // 4. Arms & Gun
        // Right arm holding gun
        ctx.fillStyle = '#0a0a1a';
        ctx.strokeStyle = '#00ffff';

        // Arm
        ctx.beginPath();
        ctx.arc(10, 5, 4, 0, Math.PI * 2); // Shoulder/Hand pos
        ctx.fill();
        ctx.stroke();

        // Gun
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.rect(10, 2, 20, 6); // Barrel
        ctx.fill();
        ctx.stroke();

        // Left arm (stabilizing)
        ctx.fillStyle = '#0a0a1a';
        ctx.beginPath();
        ctx.arc(5, 10, 3, 0, Math.PI * 2); // Left hand under gun
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    public getPosition(): Vector2 {
        return this.position.clone();
    }
}
