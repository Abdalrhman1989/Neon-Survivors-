export class HUD {
    private scoreEl: HTMLElement;
    private hpEl: HTMLElement;
    private waveEl: HTMLElement;
    private gameOverEl: HTMLElement;
    private mainMenuEl: HTMLElement;

    constructor() {
        const container = document.getElementById('ui-layer');
        if (!container) throw new Error('UI Layer not found');

        // Styles for Tech HUD
        const styles = `
            .hud-panel {
                position: absolute;
                padding: 10px 20px;
                background: linear-gradient(135deg, rgba(0, 20, 40, 0.8), rgba(0, 0, 0, 0.9));
                border: 1px solid #00ffff;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
                color: #00ffff;
                font-family: 'Courier New', Courier, monospace;
                text-transform: uppercase;
                letter-spacing: 2px;
                transform: skewX(-15deg);
            }
            .hud-label {
                font-size: 12px;
                color: #88aaff;
                margin-bottom: 5px;
                display: block;
            }
            .hud-value {
                font-size: 24px;
                font-weight: bold;
                text-shadow: 0 0 5px currentColor;
            }
            .bar-container {
                width: 200px;
                height: 10px;
                background: #111;
                border: 1px solid #333;
                margin-top: 5px;
                transform: skewX(15deg); /* Counter skew inner */
            }
            .bar-fill {
                height: 100%;
                background: #00ff00;
                width: 100%;
                box-shadow: 0 0 10px #00ff00;
                transition: width 0.2s, background-color 0.2s;
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.innerHTML = styles;
        document.head.appendChild(styleEl);

        container.innerHTML = `
            <!-- Top Left: Health -->
            <div class="hud-panel" style="top: 20px; left: 20px;">
                <span class="hud-label">Systems Integrity</span>
                <div class="bar-container" style="transform: skewX(0);">
                    <div id="hp-bar" class="bar-fill"></div>
                </div>
                <div style="margin-top: 5px; display: flex; justify-content: space-between;">
                    <span class="hud-value" id="hp-val">100%</span>
                </div>
            </div>

            <!-- Top Right: Score & Wave -->
            <div class="hud-panel" style="top: 20px; right: 20px; text-align: right;">
                <span class="hud-label">Score</span>
                <div class="hud-value" id="score-val" style="color: #ff00ff;">0</div>
                <div style="margin-top: 10px;">
                    <span class="hud-label">Wave</span>
                    <div class="hud-value" id="wave-val" style="color: #ffff00;">1</div>
                </div>
            </div>

            <!-- Game Over Screen -->
            <div id="game-over" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto;">
                <h1 style="font-size: 80px; margin: 0; color: #ff0000; text-shadow: 0 0 20px #ff0000; font-family: 'Courier New'; text-transform: uppercase;">SIGNAL LOST</h1>
                <div style="border-top: 2px solid #ff0000; width: 300px; margin: 20px 0;"></div>
                <p style="font-size: 24px; color: #fff; font-family: 'Courier New';">Press <span style="color: #00ffff; font-weight: bold;">SPACE</span> to Reboot System</p>
            </div>

            <!-- Main Menu -->
            <div id="main-menu" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 20; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto;">
                <h1 style="font-size: 80px; margin: 0; color: #00ffff; text-shadow: 0 0 40px #00ffff; font-family: 'Courier New'; letter-spacing: 10px;">NEON<br>SURVIVORS</h1>
                <p style="font-size: 18px; color: #88aaff; margin-top: 10px; font-family: 'Courier New';">TACTICAL GRID DEFENSE PROTOCOL</p>
                
                <div style="margin-top: 60px; padding: 20px; border: 1px solid #00ffff; transform: skewX(-10deg); cursor: pointer; color: #00ffff; font-family: 'Courier New'; font-size: 24px;">
                    INSERT COIN <span style="font-size: 14px; display: block; margin-top: 5px; color: #fff;">(PRESS ENTER)</span>
                </div>

                <div style="margin-top: 40px; font-size: 14px; color: #555; font-family: 'Courier New';">
                    [WASD] MOVE // [MOUSE] AIM + SHOOT
                </div>
            </div>
        `;

        this.scoreEl = document.getElementById('score-val')!;
        this.hpEl = document.getElementById('hp-val')!;
        this.waveEl = document.getElementById('wave-val')!;
        this.gameOverEl = document.getElementById('game-over')!;
        this.mainMenuEl = document.getElementById('main-menu')!;

        // Initial state
        this.gameOverEl.style.display = 'none';
        this.mainMenuEl.style.display = 'flex';
    }

    public update(score: number, hp: number, wave: number): void {
        this.scoreEl.innerText = score.toString();
        this.hpEl.innerText = `${Math.ceil(hp)}%`;
        this.waveEl.innerText = wave.toString();

        const hpBar = document.getElementById('hp-bar');
        if (hpBar) {
            hpBar.style.width = `${Math.max(0, hp)}%`;
            if (hp > 50) hpBar.style.backgroundColor = '#00ff00';
            else if (hp > 20) hpBar.style.backgroundColor = '#ffff00';
            else hpBar.style.backgroundColor = '#ff0000';
            hpBar.style.boxShadow = `0 0 10px ${hpBar.style.backgroundColor}`;
        }
    }

    public showGameOver(): void {
        this.gameOverEl.style.display = 'flex';
    }

    public hideGameOver(): void {
        this.gameOverEl.style.display = 'none';
    }

    public showMainMenu(): void {
        this.mainMenuEl.style.display = 'flex';
    }

    public hideMainMenu(): void {
        this.mainMenuEl.style.display = 'none';
    }
}
