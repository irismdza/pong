import './styles/game.css';
import Game from './partials/Game'

const game = new Game('game', 512, 256);

(function gameLoop() {
    game.render();
    requestAnimationFrame(gameLoop);
})();
