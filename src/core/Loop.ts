export class Loop {
    private lastTime: number = 0;
    private running: boolean = false;
    private animationFrameId: number = 0;

    constructor(
        private update: (dt: number) => void,
        private render: () => void
    ) { }

    public start(): void {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    public stop(): void {
        this.running = false;
        cancelAnimationFrame(this.animationFrameId);
    }

    private loop = (timestamp: number): void => {
        if (!this.running) return;

        // Calculate delta time in seconds
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to prevent huge jumps if tab is inactive (e.g. max 0.1s)
        const safeDt = Math.min(dt, 0.1);

        this.update(safeDt);
        this.render();

        this.animationFrameId = requestAnimationFrame(this.loop);
    };
}
