import { Game } from './core/Game';

// Actually, I deleted style.css, so I should remove this import.

// Bootstrapping the game
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  const game = new Game(canvas);
  game.start();
});
