/* --------
   Game.ts

   Controls the functionality of the Starfox Minigame
   -------- */
var TSOS;
(function (TSOS) {
    class Game {
        static initAssets() {
            _Game = document.getElementById('gameWindow');
            _GameContext = _Game.getContext("2d");
            _GameContext.fillStyle = "#AABB11";
            _GameContext.fillRect(0, 0, 300, 300);
        }
        static startCutscene() {
        }
        static skipCutscene() {
        }
        static launchGame() {
        }
        static endGame() {
        }
    }
    TSOS.Game = Game;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=game.js.map