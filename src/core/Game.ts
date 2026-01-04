import { Loop } from './Loop';
import { Input } from './Input';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Spawner } from '../systems/Spawner';
import { Collision } from '../systems/Collision';
import { HUD } from '../ui/HUD';

export class Game {
    private loop: Loop;
    private input: Input;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;

    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];
    private spawner: Spawner;
    private collision: Collision;
    private hud: HUD;

    // private fireRate: number = 0.1; // Moved to Weapon
    // private fireTimer: number = 0;  // Moved to Weapon

    private score: number = 0;
    private isGameOver: boolean = false;
    private isMenu: boolean = true;

    private shake: number = 0;

    private width: number = 0;
    private height: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        this.ctx = ctx;

        this.input = new Input();
        this.hud = new HUD();
        this.hud.showMainMenu();

        this.loop = new Loop(this.update.bind(this), this.render.bind(this));

        // Player needs a callback to spawn bullets
        this.player = new Player(window.innerWidth / 2, window.innerHeight / 2, this.spawnBullet.bind(this));

        // Init Pools
        for (let i = 0; i < 100; i++) this.bullets.push(new Bullet());
        for (let i = 0; i < 50; i++) this.enemies.push(new Enemy());

        // Init Systems
        this.spawner = new Spawner();
        this.collision = new Collision();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.hud.update(0, 100, 1);
    }

    public start(): void {
        this.loop.start();
    }

    private resize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    private update(dt: number): void {
        // Menu State
        if (this.isMenu) {
            if (this.input.isKeyDown('Enter')) {
                this.startGame();
            }
            return;
        }

        // Game Over State
        if (this.isGameOver) {
            if (this.input.isKeyDown('Space')) {
                this.restart();
            }
            return;
        }

        // Screen Shake decay
        if (this.shake > 0) {
            this.shake -= dt * 30; // Decay speed
            if (this.shake < 0) this.shake = 0;
        }

        this.player.update(dt, this.input);

        if (this.player.isDead()) {
            this.isGameOver = true;
            this.hud.showGameOver();
        }

        // Shooting via Player Weapon
        if (this.input.getIsMouseDown()) {
            const mouse = this.input.getMousePos();
            this.player.weapon.shoot(
                this.player.position.x,
                this.player.position.y,
                mouse.x,
                mouse.y
            );
        }

        // Entities
        this.bullets.forEach(b => b.update(dt));
        this.enemies.forEach(e => e.update(dt, this.player.getPosition()));

        // Systems
        this.spawner.update(dt, this.enemies, this.player.getPosition());
        this.collision.update(this.player, this.enemies, this.bullets,
            (scoreToAdd) => {
                this.score += scoreToAdd;
            },
            (damage) => {
                this.player.takeDamage(damage);
                this.shake = 10; // Trigger shake
            }
        );

        // Check damage for shake (simple check if player hp changed? No, better to have callback)
        // For now, I'll rely on hp check or just existing logic.
        // Ideally Collision should return "damageTaken" or call a shake method.
        // I'll leave it simple: if player took damage, shake.
        // Since collision handles damage internally to player, I don't know easily.
        // But I can check logic in collision callback if I refactor collision update.
        // Or just add a method to Game 'addShake(amount)' and pass it to collision.
        // Passing just `scoreCallback` restricts me.
        // I will refactor Collision to take an object of callbacks or separate callbacks?
        // Or simpler: Collision returns events?
        // Let's stick to what we have. Shake is optional "Nice to have". 
        // I'll add a dirty check: keep lastHp.
        if (this.player.hp < this.player.maxHp && (this.player.hp % 10 !== 0)) { // Hacky hook?
            // No, let's just act like it shakes on everything for now or skip it.
            // ACTUALLY: I'll modify Collision to take 'onDamage' callback too.
        }

        // Update UI
        this.hud.update(this.score, this.player.hp, this.spawner.wave);
    }

    private render(): void {
        this.ctx.save();

        // Apply Shake
        if (this.shake > 0) {
            const dx = (Math.random() - 0.5) * this.shake;
            const dy = (Math.random() - 0.5) * this.shake;
            this.ctx.translate(dx, dy);
        }

        // Clear with slight transparency for trail effect? No, let's stick to clean redraw for now.
        this.ctx.fillStyle = '#050510'; // Darker, slightly blue-ish black
        this.ctx.fillRect(-10, -10, this.width + 20, this.height + 20);

        this.renderBackground();

        this.bullets.forEach(b => b.render(this.ctx));
        this.enemies.forEach(e => e.render(this.ctx));
        this.player.render(this.ctx);

        this.ctx.restore();
    }

    private renderBackground(): void {
        const gridSize = 50;
        const offsetX = this.player.getPosition().x % gridSize;
        const offsetY = this.player.getPosition().y % gridSize;

        this.ctx.save();
        this.ctx.strokeStyle = '#1a1a40'; // Faint cyber blue
        this.ctx.lineWidth = 1;

        // Draw Vertical Lines
        for (let x = -offsetX; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // Draw Horizontal Lines
        for (let y = -offsetY; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Add a "Horizon" glow or vignette
        const gradient = this.ctx.createRadialGradient(this.width / 2, this.height / 2, this.height / 3, this.width / 2, this.height / 2, this.height);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore();
    }

    private startGame(): void {
        this.isMenu = false;
        this.isGameOver = false;
        this.hud.hideMainMenu();
        this.hud.hideGameOver();
        this.resetGame();
    }

    private restart(): void {
        this.startGame();
    }

    private resetGame(): void {
        this.score = 0;
        this.spawner = new Spawner(); // Reset wave
        this.player = new Player(this.width / 2, this.height / 2, this.spawnBullet.bind(this));
        this.bullets.forEach(b => b.deactivate());
        this.enemies.forEach(e => e.deactivate());
        this.hud.update(0, 100, 1);
    }

    private spawnBullet(x: number, y: number, angle: number): void {
        const bullet = this.bullets.find(b => !b.active);
        if (!bullet) return;

        bullet.activate(x, y, angle);
    }
}
