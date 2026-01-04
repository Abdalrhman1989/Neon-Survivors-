export class Weapon {
    private fireRate: number = 0.1;
    private fireTimer: number = 0;

    constructor(
        private onFire: (x: number, y: number, angle: number) => void
    ) { }

    public update(dt: number): void {
        this.fireTimer += dt;
    }

    public isReady(): boolean {
        return this.fireTimer >= this.fireRate;
    }

    public shoot(x: number, y: number, targetX: number, targetY: number): boolean {
        if (!this.isReady()) return false;

        this.fireTimer = 0;
        const angle = Math.atan2(targetY - y, targetX - x);
        this.onFire(x, y, angle);
        return true;
    }
}
