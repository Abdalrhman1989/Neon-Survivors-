# Neon Survivors

A high-performance top-down shooter game built with **TypeScript** and **HTML5 Canvas**. No engines, just pure code.

## 🎮 How to Play

1.  **Move**: WASD keys.
2.  **Aim**: Mouse cursor.
3.  **Shoot**: Click and hold.
4.  **Goal**: Survive endless waves of enemies.

## 🚀 Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🏗️ Architecture

The project follows a clean, modular structure:

-   `src/core/`: Core engine components (Game loop, Input handling, Canvas setup).
-   `src/entities/`: Game objects (Player, Enemy, Bullet).
-   `src/systems/`: Logic managers (Collision detection, Wave Spawner).
-   `src/ui/`: UI management (HUD, Menus) via HTML overlay.
-   `src/utils/`: Helper classes (Vector2 math).

### Key Technical Features

-   **ECS-lite Structure**: Logic separated from data where suitable.
-   **Object Pooling**: Bullets and Enemies are pooled to avoid Garbage Collection spikes and ensure smooth 60 FPS performance.
-   **Frame-Independent Movement**: Uses `dt` (delta time) for consistent speeds across frame rates.
-   **Custom Systems**:
    -   `Loop.ts`: Custom `requestAnimationFrame` wrapper.
    -   `Input.ts`: Event-based input abstraction.
    -   `Collision.ts`: Efficient spatial checking.

## 🛠️ Deploy

Push to GitHub and connect to Vercel/Netlify. The build output is static HTML/JS/CSS.
