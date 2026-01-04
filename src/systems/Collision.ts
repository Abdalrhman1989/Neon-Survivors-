import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';

export class Collision {
    public update(
        player: Player,
        enemies: Enemy[],
        bullets: Bullet[],
        onScore: (amount: number) => void,
        onDamage: (amount: number) => void
    ): void {
        // Bullets vs Enemies
        for (const bullet of bullets) {
            if (!bullet.active) continue;

            for (const enemy of enemies) {
                if (!enemy.active) continue;

                const dist = bullet.position.sub(enemy.position).mag();
                if (dist < bullet.radius + enemy.radius) {
                    bullet.deactivate();
                    enemy.deactivate();
                    onScore(10);
                }
            }
        }

        // Enemies vs Player
        for (const enemy of enemies) {
            if (!enemy.active) continue;

            const dist = player.position.sub(enemy.position).mag();
            // Player radius hardcoded 15
            if (dist < 15 + enemy.radius) {
                onDamage(10);
                enemy.deactivate();
            }
        }
    }
}
