import { Enemy } from '../entities/Enemy';
import { Vector2 } from '../utils/Vector2';

export class Spawner {
    public wave: number = 1;
    private spawnTimer: number = 0;
    private spawnInterval: number = 1.0; // Seconds between spawns
    private waveTimer: number = 0;
    private readonly waveDuration: number = 20; // Seconds per wave

    constructor() { }

    public update(dt: number, enemies: Enemy[], playerPos: Vector2): void {
        // Wave progression
        this.waveTimer += dt;
        if (this.waveTimer > this.waveDuration) {
            this.waveTimer = 0;
            this.wave++;
            this.spawnInterval = Math.max(0.2, 1.0 - (this.wave * 0.05)); // Increase difficulty
        }

        this.spawnTimer += dt;

        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy(enemies, playerPos);
        }
    }

    private spawnEnemy(enemies: Enemy[], playerPos: Vector2): void {
        // Find inactive enemy
        const enemy = enemies.find(e => !e.active);
        if (!enemy) return; // Pool empty

        // Spawn at random position away from player
        // Angle
        const angle = Math.random() * Math.PI * 2;
        // Distance (off screen ideally, or just far)
        const dist = 400 + Math.random() * 200;

        const x = playerPos.x + Math.cos(angle) * dist;
        const y = playerPos.y + Math.sin(angle) * dist;

        enemy.activate(x, y);
    }
}
