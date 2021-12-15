/* --------
   Game.ts

   Controls the functionality of the Starfox Minigame
   -------- */

   module TSOS {

    export class Game {
        // rework methods into an object-kind.
        // make the _Game var in globals be of this class' type
        public static initAssets() : void {
            _Game = <HTMLCanvasElement>document.getElementById('gameWindow');
            _GameContext = <CanvasRenderingContext2D>_Game.getContext("2d");

            _GameContext.fillStyle = "#AABB11";
            _GameContext.fillRect(0,0,300,300);
        }

        public static startCutscene() : void {

        }

        public static skipCutscene() : void {

        }

        public static launchGame() : void {

        }

        public static endGame() : void {

        }

    }
}
